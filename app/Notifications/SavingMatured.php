<?php

namespace App\Notifications;

use App\Models\Saving;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SavingMatured extends Notification
{
  use Queueable;
  public $desc, $saving_id, $plan_name;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct(Saving $saving)
  {
    $this->desc = $saving->desc;
    $this->saving_id = $saving->id;
    $this->plan_name = $saving->plan->name;
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

  public function toDatabase($notifiable)
  {
    return [
      "saving_id"     => $this->saving_id,
      "type"          => "savings.matured",
      "message"       => trans('notice.savings._matured', ['desc' => $this->desc, 'name' => $this->plan_name]),
    ];
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
