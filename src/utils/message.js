const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

// Функция для группировки сообщений по месяцам
function groupMessagesByMonth(messages) {
    const groupedMessages = {};

    messages.forEach(message => {
        const date = new Date(message.dttmCreated);
        const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

        if (!groupedMessages[monthKey]) {
            groupedMessages[monthKey] = [];
        }

        groupedMessages[monthKey].push(message);
    });

    return groupedMessages;
}

// Функция для создания списка блоков с сообщениями для каждого месяца
export function createMessageBlocks(messages) {
    const groupedMessages = groupMessagesByMonth(messages);
    const messageBlocks = [];

    for (const monthKey in groupedMessages) {
        if (groupedMessages.hasOwnProperty(monthKey)) {
            messageBlocks.push({
                date: monthKey,
                messages: groupedMessages[monthKey]
            });
        }
    }

    return messageBlocks;
}
