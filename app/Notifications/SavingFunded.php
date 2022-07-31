<?php

namespace App\Notifications;

use App\Models\Saving;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SavingFunded extends Notification
{
  use Queueable;
  public $desc, $saving_id, $amount;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct(Saving $saving, Transaction $transaction)
  {
    $this->desc = $saving->desc;
    $this->saving_id = $saving->id;
    $this->amount = $transaction->amount;
  }

  public function toDatabase($notifiable)
  {
    return [
      "saving_id"     => $this->saving_id,
      "type"          => "savings.funded",
      "message"       => trans('notice.savings._funded', ['desc' => $this->desc, 'amount' => $this->amount]),
    ];
  }

  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    return ['database'];
  }

  /**
   * Get the mail representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return \Illuminate\Notifications\Messages\MailMessage
   */
  public function toMail($notifiable)
  {
    return (new MailMessage)
      ->line('The introduction to the notification.')
      ->action('Notification Action', url('/'))
      ->line('Thank you for using our application!');
  }

  /**
   * Get the array representation of the notification.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    return [
      //
    ];
  }
}
