<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationFromSettingsEmail extends Mailable
{
    use Queueable, SerializesModels;

    public string $email = '';
    public string $subjectText = '';
    public string $htmlContent = '';
    /**
     * Create a new message instance.
     */
    public function __construct(string $email, string $subjectText = "Registration Email", string $htmlContent)
    {
        $this->email = $email;
        $this->subjectText = $subjectText;
        $this->htmlContent = $htmlContent;
    }


    /**
     * Build the message using raw HTML content.
     */
    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->subject($this->subjectText)
            ->html($this->htmlContent);
    }
}
