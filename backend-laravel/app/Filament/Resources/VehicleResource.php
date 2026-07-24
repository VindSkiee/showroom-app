<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages\{ListVehicles, CreateVehicle, EditVehicle};
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class VehicleResource extends Resource
{
    protected static ?string $model = Vehicle::class;
    protected static ?string $navigationIcon = 'heroicon-o-motorbike';
    protected static ?string $navigationGroup = 'Inventory';
    protected static ?string $modelLabel = 'Motor';
    protected static ?string $pluralModelLabel = 'Motor';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Informasi Dasar')->schema([
                Forms\Components\TextInput::make('name')->label('Nama')->required(),
                Forms\Components\TextInput::make('model')->label('Model')->required(),
                Forms\Components\TextInput::make('license_plate')->label('Plat Nomor')->required(),
                Forms\Components\Select::make('type')->label('Tipe')
                    ->options([
                        'matic' => 'Matic',
                        'manual' => 'Manual',
                        'sport' => 'Sport',
                        'cruiser' => 'Cruiser',
                        'scoopy' => 'Scoopy',
                    ])->required(),
                Forms\Components\TextInput::make('year')->label('Tahun')->numeric()->required(),
                Forms\Components\TextInput::make('price')->label('Harga')->numeric()->required(),
                Forms\Components\TextInput::make('purchase_price')->label('Harga Beli')->numeric(),
            ])->columns(3),

            Forms\Components\Section::make('Status')->schema([
                Forms\Components\Select::make('availability_status')->label('Ketersediaan')
                    ->options(['available' => 'Tersedia', 'sold_out' => 'Habis']),
                Forms\Components\TextInput::make('stock')->label('Stok')->numeric()->default(1),
                Forms\Components\TextInput::make('stock_sold')->label('Terjual')->numeric()->default(0),
                Forms\Components\Select::make('document_status')->label('Dokumen')
                    ->options(['complete' => 'Lengkap', 'incomplete' => 'Belum Lengkap']),
                Forms\Components\Textarea::make('document_note')->label('Catatan Dokumen'),
                Forms\Components\Select::make('tax_status')->label('Pajak')
                    ->options(['active' => 'Aktif', 'expired' => 'Mati', 'unknown' => 'Tidak Diketahui']),
                Forms\Components\TextInput::make('tax_expiry_year')->label('Pajak Berlaku Hingga')->numeric(),
                Forms\Components\TextInput::make('tax_expired_from')->label('Pajak Mati Dari')->numeric(),
                Forms\Components\Select::make('defect_status')->label('Kerusakan')
                    ->options(['none' => 'Tidak Ada', 'minor' => 'Ringan', 'major' => 'Berat']),
            ])->columns(3),

            Forms\Components\Section::make('Promo')->schema([
                Forms\Components\Select::make('promo_id')->label('Promo')
                    ->relationship('promo', 'title')
                    ->searchable()
                    ->preload()
                    ->nullable(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->label('ID')->sortable(),
                Tables\Columns\TextColumn::make('name')->label('Nama')->searchable(),
                Tables\Columns\TextColumn::make('model')->label('Model'),
                Tables\Columns\TextColumn::make('type')->label('Tipe')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'matic' => 'success',
                        'manual' => 'info',
                        'sport' => 'warning',
                        'cruiser' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('price')->label('Harga')
                    ->money('IDR', locale: 'id_ID')->sortable(),
                Tables\Columns\TextColumn::make('stock')->label('Stok')->sortable(),
                Tables\Columns\TextColumn::make('availability_status')->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'available' => 'success',
                        'sold_out' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('promo.title')->label('Promo'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')->label('Tipe')
                    ->options(['matic' => 'Matic', 'manual' => 'Manual', 'sport' => 'Sport', 'cruiser' => 'Cruiser', 'scoopy' => 'Scoopy']),
                Tables\Filters\SelectFilter::make('availability_status')->label('Status')
                    ->options(['available' => 'Tersedia', 'sold_out' => 'Habis']),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListVehicles::route('/'),
            'create' => CreateVehicle::route('/create'),
            'edit' => EditVehicle::route('/{record}/edit'),
        ];
    }
}
