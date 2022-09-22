<?php

namespace App\Notifications\Wallet;

use App\Models\Transaction;
use App\Models\UserAccount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\OneSignal\OneSignalChannel;
use NotificationChannels\OneSignal\OneSignalMessage;

class WithdrawToAccount extends Notification implements ShouldQueue
{
  use Queueable;

  public $amount, $account_number, $bank_name, $wallet_id;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct(Transaction $transaction, UserAccount $userAccount)
  {
    $this->amount = $transaction->amount;
    $this->account_number = $userAccount->account_number;
    $this->wallet_id = $transaction->wallet->id;
    $this->bank_name = $userAccount->bank_name ?? '';
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

  public function toOneSignal($notifiable)
  {
    $subject = "Withdrawal to account";

    return OneSignalMessage::create()
      ->setSubject($subject)
      ->setBody(trans('notice.wallet._withdraw2account', [
        'amount'      => 0 - $this->amount,
        'bank_name'   => $this->bank_name,
        'currency'    => 'NGN',
        'account_number' => $this->account_number,
      ]))
      ->setGroup($this->wallet_id, ['en' => $subject])
      ->setData('wallet_id',  $this->wallet_id)
      ->setData("type",             'wallet.withdraw2account')
      ->setParameter('thread_id',   $this->wallet_id);
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
      "wallet_id"     => $this->wallet_id,
      "type"          => "wallet.withdraw2account",
      "message"       => trans('notice.wallet._withdraw2account', [
        'amount'      => 0 - $this->amount,
        'bank_name'   => $this->bank_name,
        'currency'    => 'NGN',
        'account_number' => $this->account_number,
      ]),
    ];
  }
}
