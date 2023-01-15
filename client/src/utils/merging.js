let dataSource = [];
export const merge = (_list, list2, list3) => {
    for (var i = 0; i < _list?.length; i++) {
        let content = {};
        if (dataSource.length === _list?.length) {
            break;
        }
        content['asset'] = _list[i]?.url;
        content['heading'] = list2[i];
        content['text'] = list3[i];

        dataSource.push(content);
    }
    return dataSource;
};