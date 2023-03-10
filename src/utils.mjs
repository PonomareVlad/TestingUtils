function inputValueByParam(id, boolean, name = id) {
    const value = getSearchParam(name)
    const input = document.getElementById(id)
    if (input && typeof value === "string")
        input.value = getSearchParam(name)
    if (input && boolean && value)
        input.checked = true
}

function printTargetParams(funcParam = "func", urlParam = "url", globalizeParam = "globalize") {
    const url = getSearchParam(urlParam)
    const globalize = getSearchParam(globalizeParam)
    const func = funcParam ? getSearchParam(funcParam) : ""
    const printFunc = funcParam ? `(Функция: ${func || `<span style="color: coral">Не указана</span>`})` : ""
    document.write(connectScript(globalize) ?
        `Подключен файл: <a href="${url}" target="_blank">${url}</a> ${printFunc}` :
        `<span style="color: coral">Файл не подключен</span>`)
}

function printVars(vars, tabs = 2) {
    const varTemplate = ([k, v]) => `${k} = ${typeof v == "object" ? JSON.stringify(v, null, 4) : v};`
    const output = Object.entries(vars).map(varTemplate).join(`\r\n`)
    document.write(["<output>", output, "</output>"].join(""))
}

function getSearchParam(name) {
    return new URL(location).searchParams.get(name)
}

function connectScript(globalize, urlParam = "url") {
    const params = new URL(location).searchParams
    if (!params.has(urlParam) || !params.get(urlParam)) return false
    document.write(`<script src="${proxyScript(params.get(urlParam), globalize)}"></script>`)
    return true
}

function proxyScript(url, globalize, funcParam = "func") {
    const apiURL = new URL("https://script-utils.vercel.app/api/globalize")
    if (globalize) {
        const variable = getSearchParam(funcParam)
        apiURL.searchParams.set("vars", variable)
    }
    apiURL.searchParams.set("source", url)
    return apiURL.href
}

function getTargetFunction(funcParam = "func") {
    return eval(getSearchParam(funcParam))
}

function printStatus(status) {
    const color = status ? "greenyellow" : "coral",
        message = status ? "Тест пройден" : "Тест не пройден"
    document.write(`<span style="color: ${color}">${message}</span>`)
}

function equal(a, b) {
    if (a === b)
        return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor)
            return false;
        var length, i, keys;
        if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length)
                return false;
            for (i = length; i-- !== 0;)
                if (!equal(a[i], b[i]))
                    return false;
            return true;
        }
        if (a.constructor === RegExp)
            return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
            return false;
        for (i = length; i-- !== 0;)
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
                return false;
        for (i = length; i-- !== 0;) {
            var key = keys[i];
            if (!equal(a[key], b[key]))
                return false;
        }
        return true;
    }
    return a !== a && b !== b;
}
