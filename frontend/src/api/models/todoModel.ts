export interface CardType {
    cardTitle: string
    tableId: number
    assign?: string
}

export interface ColumnType {
    columnTitle: string
    id: number
    cards: CardType[]
}

export interface TodoType {
    todoTitle: string
    columns: ColumnType[]
}

export const preparedColumns: TodoType[] = [
    {
        todoTitle: "Symtax error",
        columns: [
            {
                columnTitle: "Надо сделать",
                id:1,
                cards: [
                    {
                        cardTitle: "Презентовать проект",
                        tableId: 1
                    },
                    {
                        cardTitle: "Отпраздновать успешную сдачу",
                        tableId: 1
                    }
                ]
            },
            {
                columnTitle: "Готово",
                id: 2,
                cards: [
                    {
                        cardTitle: "Авторизация",
                        tableId: 2
                    },
                    {
                        cardTitle: "Профили пользователей",
                        tableId: 2
                    },
                    {
                        cardTitle: "Система чатов",
                        tableId: 2
                    },
                    {
                        cardTitle: "Главная страница",
                        tableId: 2
                    },
                    {
                        cardTitle: "ToDo листы",
                        tableId: 2
                    }
                ]
            }
        ]
    }
];