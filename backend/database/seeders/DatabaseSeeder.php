<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Waste;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Demo user
        $demo = User::firstOrCreate(
            ['email' => 'demo@ecoruk.id'],
            [
                'name'     => 'Eco Warrior',
                'password' => Hash::make('password123'),
            ]
        );

        // Waste entries (campuran status)
        $types = ['plastik', 'kertas', 'organik', 'kardus', 'logam'];

        $entries = [
            ['waste_type' => 'organik',  'weight' => 12.5, 'status' => 'verified'],
            ['waste_type' => 'plastik',  'weight' => 8.0,  'status' => 'verified'],
            ['waste_type' => 'kertas',   'weight' => 6.0,  'status' => 'exchanged'],
            ['waste_type' => 'kardus',   'weight' => 10.0, 'status' => 'verified'],
            ['waste_type' => 'logam',    'weight' => 4.5,  'status' => 'verified'],
            ['waste_type' => 'plastik',  'weight' => 3.0,  'status' => 'pending'],  // tidak dihitung
            ['waste_type' => 'organik',  'weight' => 2.0,  'status' => 'rejected'], // tidak dihitung
            ['waste_type' => 'kertas',   'weight' => 7.0,  'status' => 'exchanged'],
        ];

        foreach ($entries as $entry) {
            $weight = $entry['weight'];
            Waste::create([
                'user_id'      => $demo->id,
                'waste_type'   => $entry['waste_type'],
                'weight'       => $weight,
                'status'       => $entry['status'],
                'reward_value' => $weight * 20,
                'co2_reduction'=> $weight * 0.5,
                'tree_impact'  => $weight * 0.02,
            ]);
        }

        // Tambah beberapa user lain agar active_users tidak 0
        for ($i = 1; $i <= 10; $i++) {
            $u = User::firstOrCreate(
                ['email' => "user{$i}@ecoruk.id"],
                ['name' => "User {$i}", 'password' => Hash::make('password123')]
            );
            Waste::create([
                'user_id'      => $u->id,
                'waste_type'   => $types[array_rand($types)],
                'weight'       => rand(2, 15),
                'status'       => 'verified',
                'reward_value' => rand(40, 300),
                'co2_reduction'=> rand(1, 8),
                'tree_impact'  => rand(1, 3) * 0.02,
            ]);
        }
    }
}
