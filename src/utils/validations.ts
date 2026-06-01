interface SalonFormValues {
  phone: string;
  city: string;
  district: string;
  address: string;
  about: string;
  imagesCount: number;
}

export const validateSalonForm = (
  values: SalonFormValues,
): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  if (!values.phone || values.phone.replace(/\s/g, "").length < 11) {
    newErrors.phone = "Telefon numarası boş bırakılamaz veya eksik girilemez.";
  }

  if (!values.city) newErrors.city = "Lütfen bir il seçin.";
  if (!values.district) newErrors.district = "Lütfen bir ilçe seçin.";

  if (!values.address.trim() || values.address.trim().length < 10) {
    newErrors.address =
      "Açık adres alanı boş bırakılamaz ve en az 10 karakter olmalıdır.";
  }

  if (!values.about.trim() || values.about.trim().length < 10) {
    newErrors.about =
      "Açıklama boş bırakılamaz ve en az 10 karakter olmalıdır.";
  }

  if (values.imagesCount < 3) {
    newErrors.images = "Vitrin için en az 3 görsel yüklemelisiniz (Maks 10).";
  }

  return newErrors;
};



export interface ServiceFormFields {
  name: string;
  price: string;
  imageFile: string;
}

export interface ServiceFormErrors {
  name?: string;
  price?: string;
  image?: string;
}

export const validateServiceForm = (fields: ServiceFormFields): ServiceFormErrors => {
  const errors: ServiceFormErrors = {};

  if (!fields.name.trim()) {
    errors.name = "Hizmet adı alanı boş bırakılamaz.";
  }

  const priceNum = Number(fields.price);
  if (!fields.price) {
    errors.price = "Fiyat alanı boş bırakılamaz.";
  } else if (isNaN(priceNum) || priceNum <= 0) {
    errors.price = "Geçerli bir fiyat giriniz.";
  }

  if (!fields.imageFile) {
    errors.image = "Görsel yüklemek zorunludur.";
  }

  return errors;
};


export const filterServiceNameInput = (value: string, currentVal: string): string => {
  const cleanVal = value.replace(/[0-9]/g, "");
  if (cleanVal.includes("  ")) {
    return currentVal;
  }
  return cleanVal;
};