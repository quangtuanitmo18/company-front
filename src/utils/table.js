export function displayItems (items, page, size) {
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size

    return items.slice(startIndex, endIndex)
}

export function setupPagination (items, page, size){
    const count = items.length
    const pages = Math.ceil(count/size)

    return {
        count,
        pages,
        page,
        size,
    }
}