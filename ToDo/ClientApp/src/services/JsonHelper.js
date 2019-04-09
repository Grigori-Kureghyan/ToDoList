export default class JsonHelper {
    isValidElement = element => {
        return element.name && element.value;
    };
    formToJson = elements => [].reduce.call(elements, (data, element) => {
        if (this.isValidElement(element)) {
            data[element.name] = element.value;
        }
        return data;
    }, {});
}