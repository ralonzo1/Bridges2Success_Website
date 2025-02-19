<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationFromSettingsEmail extends Mailable
{
    use Queueable, SerializesModels;

    public string $name = '';
    public string $email = '';
    public string $htmlContent = '';
    /**
     * Create a new message instance.
     */
    public function __construct(string $email, string $name, string $htmlContent)
    {
        $this->name = $name;
        $this->email = $email;
        $this->htmlContent = $htmlContent;
    }


    /**
     * Build the message using raw HTML content.
     */
    public function build()
    {
        return $this->from(config('mail.from.address'), config('mail.from.name'))
            ->subject('Registration Email')
            ->html($this->htmlContent);
    }
}
