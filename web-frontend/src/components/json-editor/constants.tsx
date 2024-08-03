export const LANGUAGE_VERSIONS = {
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  json: "1.0"
};

export const CODE_SNIPPETS = {
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  json: `{\n\t"name": "Énio Paulo",\n\t"province": "Luanda"\n}\n`
};