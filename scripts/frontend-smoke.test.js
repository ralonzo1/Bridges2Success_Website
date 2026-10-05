import React from 'react';
import {render, screen, fireEvent, waitFor, cleanup, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import Registration from '../frontend/src/pages/Registration';
import Contact from '../frontend/src/pages/Contact';
import Portal from '../frontend/src/pages/portal';
import Videos from '../frontend/src/pages/videos';
import App from '../frontend/src/App';

// These tests exercise frontend behavior only. No backend, email, CAPTCHA service,
// image conversion worker, video service or production connection is used.
jest.mock('heic2any',()=>jest.fn());
jest.mock('heic-to',()=>({heicTo:jest.fn()}));
jest.mock('react-google-recaptcha',()=>function TestCaptcha({onChange}){
  return <button type="button" onClick={()=>onChange('synthetic-v2')}>Test CAPTCHA</button>;
});
jest.mock('../frontend/src/layout/Header',()=>()=> <header>Test header</header>);
jest.mock('../frontend/src/layout/Footer',()=>()=> <footer>Test footer</footer>);

beforeEach(()=>{
  document.body.innerHTML='<div id="root"></div>';
  sessionStorage.clear();
  window.history.replaceState({},'', '/');
  window.grecaptcha={ready:callback=>callback(),execute:jest.fn().mockResolvedValue('synthetic-v3')};
  window.alert=jest.fn();
  HTMLElement.prototype.scrollIntoView=jest.fn();
  global.fetch=jest.fn().mockRejectedValue(new Error('Unmocked request blocked'));
  process.env.REACT_APP_API_URL='http://127.0.0.1:4173';
  process.env.REACT_APP_API_PREFIX='api';
  process.env.REACT_APP_RECAPTCHA_SITE_KEY='test-v3';
  process.env.REACT_APP_RECAPTCHA_SITE_KEY_v2='test-v2';
});
afterEach(()=>{cleanup();jest.restoreAllMocks();});
async function mount(component){
  render(component,{container:document.getElementById('root')});
  await act(async()=>{document.querySelectorAll('script[src*="recaptcha/api.js"]').forEach(script=>fireEvent.load(script));});
}
function fill(name,value){fireEvent.change(document.querySelector(`[name="${name}"]`),{target:{value}});}
async function fillRegistration(){
  await mount(<Registration/>);
  fireEvent.click(screen.getByText('Test CAPTCHA'));
  for(const [name,value] of Object.entries({firstName:'Test',lastName:'Registrant',phone:'5550100000',email:'test@example.invalid',programsReferredTo:'Test program',referredBy:'Synthetic referral',note:'Synthetic notes',gender:'Male',relationshipWithVictim:'Other',intakePreference:'Online',location:'Salem'}))fill(name,value);
  const date=document.querySelector('.react-datepicker-wrapper input');
  fireEvent.change(date,{target:{value:'01/15/1990'}});fireEvent.blur(date);
  fireEvent.click(document.querySelector('[name="chkAgree"]'));
  fireEvent.click(document.querySelector('[name="chkPermission"]'));
}
test('registration missing required values prevents an API request',async()=>{
  await mount(<Registration/>);fireEvent.click(screen.getByText('Test CAPTCHA'));
  fireEvent.submit(document.querySelector('form'));
  expect(await screen.findByText('First Name is required')).toBeVisible();
  expect(fetch).not.toHaveBeenCalled();
});
test('registration posts mapped form fields and displays successful HTTP receipt',async()=>{
  fetch.mockResolvedValue({ok:true,status:200});await fillRegistration();fireEvent.submit(document.querySelector('form'));
  expect(await screen.findByText(/Your registration has been submitted!/)).toBeVisible();
  expect(fetch).toHaveBeenCalledTimes(1);
  const [url,request]=fetch.mock.calls[0];expect(url).toBe('http://127.0.0.1:4173/api/upload-client');expect(request.method).toBe('POST');
  expect(request.body.get('firstName')).toBe('Test');expect(request.body.get('DOB')).toBe('1990-01-15');
  expect(request.body.get('chkAgree')).toBe('1');expect(request.body.get('chkPermission')).toBe('1');
  expect(request.body.get('note')).toBe('Synthetic notes');expect(request.body.get('recaptchaToken')).toBe('synthetic-v3');
  expect(request.body.has('recaptchaTokenV2')).toBe(false);
});
test.each([403,422,429,500])('existing registration HTTP %s receipt-like alert is preserved and documented',async status=>{
  fetch.mockResolvedValue({ok:false,status});await fillRegistration();fireEvent.submit(document.querySelector('form'));
  await waitFor(()=>expect(window.alert).toHaveBeenCalledWith('We have received your information and will be in touch soon'));
});
test('registration network failure displays retry message',async()=>{
  jest.spyOn(console,'error').mockImplementation(()=>{});
  await fillRegistration();fireEvent.submit(document.querySelector('form'));
  await waitFor(()=>expect(window.alert).toHaveBeenCalledWith('An error occurred. Please try again.'));
});
test('contact submits only to mocked API and displays acknowledgment',async()=>{
  fetch.mockResolvedValue({ok:true});await mount(<Contact/>);fireEvent.click(screen.getByText('Test CAPTCHA'));
  fill('email','test@example.invalid');fill('subject','Synthetic contact');fill('message','No mail delivery');fireEvent.submit(document.querySelector('form'));
  expect(await screen.findByText('Thank you!')).toBeVisible();
  const [url,request]=fetch.mock.calls[0];expect(url).toBe('http://127.0.0.1:4173/api/store-contact-us-query');
  expect(JSON.parse(request.body).email).toBe('test@example.invalid');
});
test('portal password result changes display state without server session',async()=>{
  fetch.mockResolvedValue({json:async()=>({success:true})});await mount(<Portal/>);
  fireEvent.change(document.querySelector('input[type="password"]'),{target:{value:'synthetic'}});fireEvent.click(screen.getByText('Test CAPTCHA'));fireEvent.submit(document.querySelector('form'));
  await waitFor(()=>expect(sessionStorage.getItem('authenticated_portal')).toBe('true'));
  expect(fetch.mock.calls[0][0]).toBe('http://127.0.0.1:4173/api/verify-portal-access');
});
test('existing portal browser-only gate can be restored without API authorization',async()=>{
  sessionStorage.setItem('authenticated_portal','true');await mount(<Portal/>);
  expect(screen.getByText(/Worksheet Downloads/)).toBeVisible();expect(fetch).not.toHaveBeenCalled();
});
test('existing video browser-only gate loads mocked Vimeo metadata without API authorization',async()=>{
  sessionStorage.setItem('authenticated_video','true');fetch.mockImplementation(async url=>{
    if(!url.startsWith('https://vimeo.com/api/oembed.json?'))throw new Error('Unexpected request');
    return {json:async()=>({title:'Fixture video',thumbnail_url:'http://127.0.0.1/fixture.jpg'})};
  });
  await mount(<Videos/>);expect(await screen.findByText('Video Resources')).toBeVisible();
  expect(fetch).toHaveBeenCalledTimes(13);
});
test.each([
  ['/','Bridges 2 Success'],['/location','Bend Office'],['/fees','Program Fees'],
  ['/survivors','Survivor’s Info'],['/contact','Contact Us'],['/grievance','Grievance'],
  ['/attendance','Attendance'],['/registration','Registration'],['/portal','Guest Area'],['/videos','Guest Area'],
])('route %s renders expected page content',async (route,text)=>{
  window.history.replaceState({},'',route);await mount(<App/>);
  expect(screen.getAllByText(new RegExp(text))[0]).toBeVisible();expect(fetch).not.toHaveBeenCalled();
});
