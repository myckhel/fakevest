@component('mail::message')
# Hello!

You are receiving this email because we received a password reset request for your account.

## Token
**{{$token}}**

This password reset token will expire in 60 minutes.

If you did not request a password reset token, no further action is required.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
