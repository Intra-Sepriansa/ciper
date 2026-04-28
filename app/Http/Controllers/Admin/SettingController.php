<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        $settings = Setting::query()->orderBy('group')->get()
            ->groupBy('group')
            ->map(fn ($items) => $items->values());

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $payload = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*.key' => ['required', 'string'],
            'settings.*.value' => ['nullable'],
            'settings.*.group' => ['nullable', 'string'],
            'settings.*.type' => ['nullable', 'string'],
            'settings.*.is_public' => ['nullable', 'boolean'],
        ]);

        foreach ($payload['settings'] as $row) {
            Setting::put(
                $row['key'],
                $row['value'] ?? '',
                $row['group'] ?? 'general',
                $row['type'] ?? 'string',
                (bool) ($row['is_public'] ?? false),
            );
        }

        Setting::flushPublicCache();

        return back()->with('success', 'Pengaturan disimpan.');
    }
}
