<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class TokenCaNhan extends SanctumPersonalAccessToken
{
    protected $table = 'token_ca_nhan';
}
