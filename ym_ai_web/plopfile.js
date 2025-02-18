module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('basics', {
    description: 'this is a skeleton plopfile',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'view name please'
      }
    ], // array of inquirer prompts
    actions: [
      {
        type: 'add',
        path: 'src/views/{{name}}/index.vue',
        templateFile: 'plop-templates/views/index.hbs'
      }
    ] // array of actions
  });
};
