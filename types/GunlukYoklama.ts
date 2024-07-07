export type GunlukYoklama = {
    Id: string;
    YoklamaId: string | undefined; 
    Kod: string;
    Tarih: string;
    Yoklama: { [ogrenciId: string]: boolean };
    BittiMi: boolean;
};