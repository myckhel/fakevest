<?php

namespace App\Notifications\Challenge;

use App\Models\Saving;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\OneSignal\OneSignalChannel;
use NotificationChannels\OneSignal\OneSignalMessage;

class Joined extends Notification implements ShouldQueue
{
  use Queueable;

  public $desc, $saving_id, $user_name;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct(Saving $challenge, User $user)
  {
    $this->desc = $challenge->desc;
    $this->saving_id = $challenge->id;
    $this->user_name = $user->fullname;
  }

  /**
   * Get the notification's delivery channels.
   *
   * @param  mixed  $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    $channels = ['database'];

    if ($notifiable->has_notifications) {
      $channels[] = OneSignalChannel::class;
    }

    return $channels;
  }

  public function toOneSignal($notifiable)
  {
    return OneSignalMessage::create()
      ->setSubject($this->user_name . ' Joined you challenge')
      ->setBody(trans('notice.challenge._joined', ['desc' => $this->desc, 'user' => $this->user_name]))
      ->setGroup($this->saving_id, ['en' => "$this->user_name Joined you challenge"])
      ->setData('saving_id',  $this->saving_id)
      ->setData("type",             'challenge.joined')
      ->setParameter('thread_id',   $this->saving_id);
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
      "saving_id"     => $this->saving_id,
      "type"          => "challenge.joined",
      "message"       => trans('notice.challenge._joined', ['desc' => $this->desc, 'user' => $this->user_name]),
    ];
  }
}
