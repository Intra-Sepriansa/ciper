<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogger
{
    public function __construct(private readonly ?Request $request = null) {}

    /**
     * @param  array<string, mixed>|null  $properties
     */
    public function log(string $action, ?Model $subject = null, ?string $description = null, ?array $properties = null): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => optional($this->request?->user())->id,
            'action' => $action,
            'subject_type' => $subject ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'description' => $description,
            'properties' => $properties,
            'ip_address' => $this->request?->ip(),
            'user_agent' => substr((string) $this->request?->userAgent(), 0, 500),
        ]);
    }
}
