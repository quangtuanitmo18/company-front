export function downloadFile (file, fileName = "filename") {
    if (!file) return

    const url = window.URL.createObjectURL(file)
    const linkElement = document.createElement('a');
    linkElement.href = url;
    linkElement.setAttribute('download', fileName); // Устанавливаем имя файла
    document.body.appendChild(linkElement);
    linkElement.click();
    linkElement.remove()

    // Очищаем URL после скачивания
    window.URL.revokeObjectURL(url);
}