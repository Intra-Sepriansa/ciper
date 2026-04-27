<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@cidurianriverside.id'],
            [
                'name' => 'Admin Cidurian',
                'password' => Hash::make('password'),
                'phone' => '081234567890',
                'email_verified_at' => now(),
                'is_active' => true,
            ],
        );
        $admin->syncRoles([UserRole::Admin->value]);

        $staff = User::query()->updateOrCreate(
            ['email' => 'kasir@cidurianriverside.id'],
            [
                'name' => 'Kasir Cidurian',
                'password' => Hash::make('password'),
                'phone' => '081234567891',
                'email_verified_at' => now(),
                'is_active' => true,
            ],
        );
        $staff->syncRoles([UserRole::Staff->value]);

        $customerUser = User::query()->updateOrCreate(
            ['email' => 'customer@example.com'],
            [
                'name' => 'Pelanggan Demo',
                'password' => Hash::make('password'),
                'phone' => '081299990000',
                'email_verified_at' => now(),
                'is_active' => true,
            ],
        );
        $customerUser->syncRoles([UserRole::Customer->value]);

        Customer::query()->updateOrCreate(
            ['user_id' => $customerUser->id],
            [
                'name' => $customerUser->name,
                'email' => $customerUser->email,
                'phone' => $customerUser->phone,
            ],
        );
    }
}
