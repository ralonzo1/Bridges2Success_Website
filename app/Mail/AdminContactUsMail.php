<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminContactUsMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $email = '';
    public string $messageFromCustomer = '';

    /**
     * Create a new message instance.
     */
    public function __construct(string $email, string $messageFromCustomer)
    {
        $this->email = $email;
        $this->messageFromCustomer = $messageFromCustomer;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Customer Enquiry',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.contact-query',
            with: [
                'email' => $this->email,
                'messageFromCustomer' => $this->messageFromCustomer
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
