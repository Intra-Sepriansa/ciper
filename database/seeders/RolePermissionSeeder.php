<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage:dashboard',
            'manage:products',
            'manage:categories',
            'manage:orders',
            'manage:payments',
            'manage:shipping',
            'manage:vouchers',
            'manage:reservations',
            'manage:reviews',
            'manage:galleries',
            'manage:customers',
            'manage:settings',
            'manage:reports',
            'manage:users',
        ];

        foreach ($permissions as $name) {
            Permission::findOrCreate($name, 'web');
        }

        $admin = Role::findOrCreate(UserRole::Admin->value, 'web');
        $admin->syncPermissions($permissions);

        $staff = Role::findOrCreate(UserRole::Staff->value, 'web');
        $staff->syncPermissions([
            'manage:dashboard',
            'manage:orders',
            'manage:payments',
            'manage:reservations',
        ]);

        Role::findOrCreate(UserRole::Customer->value, 'web');
    }
}
