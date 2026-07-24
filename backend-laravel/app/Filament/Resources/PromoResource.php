<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PromoResource\Pages\{ListPromos, CreatePromo, EditPromo};
use App\Models\Promo;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PromoResource extends Resource
{
    protected static ?string $model = Promo::class;
    protected static ?string $navigationIcon = 'heroicon-o-megaphone';
    protected static ?string $navigationGroup = 'Marketing';
    protected static ?string $modelLabel = 'Promo';
    protected static ?string $pluralModelLabel = 'Promo';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Detail Promo')->schema([
                Forms\Components\TextInput::make('title')->label('Judul')->required(),
                Forms\Components\RichEditor::make('description')->label('Deskripsi'),
                Forms\Components\TextInput::make('discount')->label('Diskon (%)')->numeric()->required(),
                Forms\Components\Toggle::make('is_active')->label('Aktif')->default(true),
                Forms\Components\FileUpload::make('banner_path')->label('Banner')
                    ->image()
                    ->directory('uploads/promos')
                    ->disk('public'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')->label('ID')->sortable(),
                Tables\Columns\TextColumn::make('title')->label('Judul')->searchable(),
                Tables\Columns\TextColumn::make('discount')->label('Diskon')->suffix('%'),
                Tables\Columns\IconColumn::make('is_active')->label('Aktif')->boolean(),
                Tables\Columns\TextColumn::make('vehicles_count')->label('Motor')->counts('vehicles'),
                Tables\Columns\TextColumn::make('cars_count')->label('Mobil')->counts('cars'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPromos::route('/'),
            'create' => CreatePromo::route('/create'),
            'edit' => EditPromo::route('/{record}/edit'),
        ];
    }
}
