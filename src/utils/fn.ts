export const setFormDataByDbData = (formData: any, dbData: any) => {
  for (const key in formData) {
    if (dbData[key] != undefined) {
      formData[key] = dbData[key]
    }
  }
}
