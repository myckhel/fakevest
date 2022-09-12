<?php

namespace App\Notifications\Challenge;

use App\Models\Saving;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\OneSignal\OneSignalChannel;
use NotificationChannels\OneSignal\OneSignalMessage;

class Milestone extends Notification
{
  use Queueable;

  public $desc, $saving_id, $count;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct(Saving $challenge)
  {
    $this->desc = $challenge->desc;
    $this->saving_id = $challenge->id;
    $this->count = 1000;
  }

  public function toDatabase($notifiable)
  {
    return [
      "saving_id"     => $this->saving_id,
      "type"          => "challenge.milestone",
      "message"       => trans('notice.challenge._milestone', ['desc' => $this->desc, 'count' => $this->count]),
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
    $channels = ['database'];

    if ($notifiable->push_notification) {
      $channels[] = OneSignalChannel::class;
    }

    return $channels;
  }

  public function toOneSignal($notifiable)
  {
    $subject = "$this->desc Reached a milestone";

    return OneSignalMessage::create()
      ->setSubject($subject)
      ->setBody(trans('notice.challenge._milestone', ['desc' => $this->desc, 'count' => $this->count]))
      ->setGroup($this->saving_id, ['en' => $subject])
      ->setData('saving_id',  $this->saving_id)
      ->setData("type",             'challenge.milestone')
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
      //
    ];
  }
}
