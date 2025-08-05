let text = "username";

const resultado = text.replace(/([a-z]+)[-_]+([a-z])([a-z]+)/gi, (match, p1, p2, p3) => {
    return p1 + p2.toUpperCase() + p3;
})
console.log(resultado);


console.log(/([a-z]+)[-_]+([a-z])([a-z]+)/gi.test(text));
