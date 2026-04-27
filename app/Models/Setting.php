<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

#[Fillable(['group', 'key', 'value', 'type', 'is_public'])]
class Setting extends Model
{
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        $value = Cache::rememberForever('setting:'.$key, function () use ($key) {
            $row = static::query()->where('key', $key)->first();

            return $row ? ['value' => $row->value, 'type' => $row->type] : null;
        });

        if (! $value) {
            return $default;
        }

        return self::cast($value['value'], $value['type']);
    }

    public static function put(string $key, mixed $value, string $group = 'general', string $type = 'string', bool $isPublic = false): void
    {
        $stored = match ($type) {
            'json', 'array' => json_encode($value),
            'bool', 'boolean' => $value ? '1' : '0',
            default => (string) $value,
        };

        static::query()->updateOrCreate(
            ['key' => $key],
            ['group' => $group, 'value' => $stored, 'type' => $type, 'is_public' => $isPublic],
        );

        Cache::forget('setting:'.$key);
    }

    public static function forget(string $key): void
    {
        static::query()->where('key', $key)->delete();
        Cache::forget('setting:'.$key);
    }

    /**
     * @return array<string, mixed>
     */
    public static function publicSettings(): array
    {
        return Cache::rememberForever('settings:public', function (): array {
            return static::query()->where('is_public', true)->get()
                ->mapWithKeys(fn (Setting $setting) => [
                    $setting->key => self::cast($setting->value, $setting->type),
                ])->all();
        });
    }

    public static function flushPublicCache(): void
    {
        Cache::forget('settings:public');
    }

    private static function cast(?string $value, string $type): mixed
    {
        if ($value === null) {
            return null;
        }

        return match ($type) {
            'int', 'integer' => (int) $value,
            'float' => (float) $value,
            'bool', 'boolean' => $value === '1' || $value === 'true',
            'json', 'array' => json_decode($value, true),
            default => $value,
        };
    }
}
