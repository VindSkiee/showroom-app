<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SaleResource\Pages\{ListSales, CreateSale};
use App\Models\Sale;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class SaleResource extends Resource
{
    protected static ?string $model = Sale::class;
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $navigationGroup = 'Sales';
    protected static ?string $modelLabel = 'Penjualan';
    protected static ?string $pluralModelLabel = 'Penjualan';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Detail Penjualan')->schema([
                Forms\Components\DatePicker::make('sale_date')->label('Tanggal')->required(),
                Forms\Components\TextInput::make('sale_price')->label('Harga Jual')->numeric()->required(),
                Forms\Components\TextInput::make('buyer_name')->label('Nama Pembeli'),
                Forms\Components\TextInput::make('quantity')->label('Jumlah')->numeric()->default(1),
                Forms\Components\Select::make('vehicle_id')->label('Motor')
                    ->relationship('vehicle', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable(),
                Forms\Components\Select::make('car_id')->label('Mobil')
                    ->relationship('car', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->label('ID')->sortable(),
                Tables\Columns\TextColumn::make('sale_date')->label('Tanggal')->date('d M Y')->sortable(),
                Tables\Columns\TextColumn::make('vehicle.name')->label('Motor'),
                Tables\Columns\TextColumn::make('car.name')->label('Mobil'),
                Tables\Columns\TextColumn::make('buyer_name')->label('Pembeli'),
                Tables\Columns\TextColumn::make('sale_price')->label('Harga')
                    ->money('IDR', locale: 'id_ID'),
                Tables\Columns\TextColumn::make('quantity')->label('Qty'),
            ])
            ->actions([
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSales::route('/'),
            'create' => CreateSale::route('/create'),
        ];
    }
}
