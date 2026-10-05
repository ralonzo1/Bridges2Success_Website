import React, {useEffect, useState} from 'react';
import RecaptchaComponent from '../Components/RecaptchaComponent';
import Modal from 'react-modal';
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Videos() {
    Modal.setAppElement('#root'); // Bind modal to root element for accessibility

    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);

    const [errors, setErrors] = useState({});

    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [recaptchaTokenV2, setRecaptchaTokenV2] = useState(null);

    const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('authenticated_video');
        if (isAuthenticated) {
            setAuthenticated(true);
        }
    }, []);


    const [videosData, setVideosData] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const videos = [
        {id: 1, url: 'https://player.vimeo.com/video/1003002302'},
        {id: 2, url: 'https://player.vimeo.com/video/1003007885'},
        {id: 3, url: 'https://player.vimeo.com/video/1003293251'},
        {id: 4, url: 'https://player.vimeo.com/video/1003310535'},
        {id: 5, url: 'https://player.vimeo.com/video/1003300674'},
        {id: 6, url: 'https://player.vimeo.com/video/1003862633'},
        {id: 7, url: 'https://player.vimeo.com/video/1003878453'},
        {id: 8, url: 'https://player.vimeo.com/video/1003875423'},
        {id: 9, url: 'https://player.vimeo.com/video/1004181270'},
        {id: 10, url: 'https://player.vimeo.com/video/1004223481'},
        {id: 11, url: 'https://player.vimeo.com/video/1002985217'},
        {id: 12, url: 'https://player.vimeo.com/video/1007067793'},
        {id: 13, url: 'https://player.vimeo.com/video/1004226079'},
    ];

    useEffect(() => {
        if (!authenticated) return;

        const fetchVideoData = async () => {
            const requests = videos.map((video) => {
                const videoId = video.url.split('/').pop();
                return fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`)
                    .then(response => response.json())
                    .then(data => ({
                        id: video.id,
                        title: data.title,
                        thumbnail: data.thumbnail_url,
                    }))
                    .catch(error => {
                        console.error(`Error fetching video data for video ID ${videoId}:`, error);
                        return null;
                    });
            });

            const results = await Promise.all(requests); // Wait for all fetch requests to complete
            const videoData = results.reduce((acc, video) => {
                if (video) {
                    acc[video.id] = {
                        title: video.title,
                        thumbnail: video.thumbnail,
                    };
                }
                return acc;
            }, {});

            setVideosData(videoData);
            setIsLoading(false); // Set loading to false after all data is fetched
        };

        fetchVideoData();
    }, [authenticated]);

    const openModal = (url) => {
        setSelectedVideo(url);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedVideo('');
    };

    useEffect(() => {
        const loadRecaptchaScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
                script.async = true;
                script.defer = true;
                script.onload = resolve;
                document.body.appendChild(script);
            });
        };

        loadRecaptchaScript().then(() => {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(siteKey, {action: 'submit'}).then((token) => {
                    setRecaptchaToken(token);
                });
            });
        });
    }, [siteKey]);

    const generateRecaptchaToken = () => {
        return window.grecaptcha.execute(siteKey, {action: 'submit'}).then((token) => {
            setRecaptchaToken(token);
            return token;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        setErrors({});

        const token = await generateRecaptchaToken();

        if (!token) {
            alert("reCAPTCHA token not available");
            return;
        }

        if (!recaptchaTokenV2) {
            newErrors.captcha = 'Please complete the reCAPTCHA.';
            setErrors(newErrors);
            return;
        }

        const formDataObj = new FormData();
        formDataObj.set('recaptchaToken', recaptchaToken);
        formDataObj.set('password', password);

        const plainFormData = {};
        formDataObj.forEach((value, key) => {
            plainFormData[key] = value;
        });

        const recaptchaVerify = await fetch(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_API_PREFIX}/verify-video-access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(plainFormData)
        });

        const result = await recaptchaVerify.json();
        if (result.success) {
            setAuthenticated(true);
            sessionStorage.setItem('authenticated_video', 'true');
            return;
        } else {
            alert('Incorrect password');
        }
    };

    if (!authenticated) {
        return (

            <div className='h-screen bg-[#daedff]  m-auto fixed top-0 w-full left-0'>
                <Header />
                <div className='fixed top-1/3 left-1/2 -translate-x-1/2'>
                    <div className="text-5xl text-center text-[#0c3c60] font-medium">Guest Area</div>
                    <form onSubmit={handleSubmit} className="p-4 text-center">
                        <div className="text-[#0c3c60] text-base font-medium">Please enter the password below.</div>
                        <input
                            placeholder="Password"
                            type="password"
                            id="password"
                            className='w-56 py-1 bg-[#ecf3c8] mt-6 border-b border-[#6ea4ca]'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="text-center my-10">
                            <RecaptchaComponent onVerify={setRecaptchaTokenV2}/>
                        </div>

                        {errors.captcha && <div className="text-center my-10"><span className="text-red-500">{errors.captcha}</span></div>}
                        <button type="submit" className='bg-[#1b99e8] my-6 w-56 py-4 text-white block m-auto'>Go</button>
                    </form>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <>
                <Header />
            <div className="flex justify-center items-center h-screen">
                <div className="text-4xl font-medium">Loading Videos...</div>
            </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <main className='bg-white p-4'>
            <h3 className="text-7xl text-center my-10 text-[#062134] font-light">Video Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="p-4 border rounded shadow-lg cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => openModal(video.url)}  // Make the whole div clickable
                    >
                        {videosData[video.id] ? (
                            <>
                                <img
                                    src={videosData[video.id].thumbnail}
                                    alt={videosData[video.id].title}
                                    className="w-full h-auto mb-2 rounded"
                                />
                                <h2 className="text-lg font-semibold mb-2">
                                    {videosData[video.id].title}
                                </h2>
                            </>
                        ) : (
                            <>
                                <div className="bg-gray-200 h-40 w-full mb-2 animate-pulse rounded"></div>
                                <h2 className="text-lg font-semibold mb-2">Loading...</h2>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className="bg-white rounded-lg shadow-lg p-4 max-w-5xl w-full mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <div className="relative">
                    <button
                        onClick={closeModal}
                        className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                    <div className="relative w-full h-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            src={`${selectedVideo}?autoplay=1`}
                            className="absolute top-0 left-0 w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                            title="Vimeo Video"
                        />
                    </div>
                </div>
            </Modal>
        </main>
            <Footer />
        </>
    );
}
