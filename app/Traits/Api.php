<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

class Props
{
  function __construct(array $props)
  {
    collect($props)->map(
      fn ($value, $key) =>
      $this->$key = is_array($value) ? new self($value) : $value
    );
  }
}


class Api
{
  public $config = [];

  public function beforeRequest()
  {
  }

  public function __construct($config)
  {
    $this->config($config);
  }

  public function config(array $config)
  {
    $this->config = new Props($config);
  }

  public function post($endpoint, $params = [], $version = null)
  {
    $this->beforeRequest();
    return $this->request($endpoint, $params, 'post', $version);
  }

  public function delete($endpoint, $params = [], $version = null)
  {
    $this->beforeRequest();
    return $this->request($endpoint, $params, 'delete', $version);
  }

  public function put($endpoint, $params = [], $version = null)
  {
    $this->beforeRequest();
    return $this->request($endpoint, $params, 'put', $version);
  }

  public function get($endpoint, $params = [], $version = null)
  {
    $this->beforeRequest();
    return $this->request($endpoint, $params, 'get', $version);
  }

  public function merge($ar, $arr)
  {
    return array_merge($ar, $arr);
  }

  public function request($endpoint, $params, $method = 'get')
  {
    $cm       = $this->config;
    $headers = [
      'Content-Type'  => 'application/json',
      'Accept'        => 'application/json'
    ];

    if (isset($cm->bearer)) {
      $headers['Authorization'] = "Bearer $cm->bearer";
    }

    $res = Http::withHeaders($headers)
      ->baseUrl($cm->url)
      ->$method(
        $endpoint,
        $params
      );

    if ($res->failed()) {
      abort($res->status(), $res->json()['message'] ?? '');
    } else {
      return $res->json();
    }
  }
}
