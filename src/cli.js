import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';


function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
     '--name': String,
     '--git': Boolean,
     '--yes': Boolean,
     '--install': Boolean,
     '-n': '--name',
     '-g': '--git',
     '-y': '--yes',
     '-i': '--install',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
   skipPrompts: args['--yes'] || false,
   git: args['--git'] || false,
   template: args._[0],
   runInstall: args['--install'] || false,
   name: args['--name'] || false,
 };
}

async function promptForMissingOptions(options) {
    const defaultTemplate = 'js';

    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use',
        choices: ['js', 'ruby'],
        default: defaultTemplate,
      });
    }

    if (!options.name) {
      questions.push({
        type: 'input',
        name: 'name',
        message: 'Name your lambda app:',
        validate: function(a){
            return a.length>0}
      });
    }
   
    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      name: options.name || answers.name,
      git: options.git || answers.git,
    };
   }
   
   export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    console.log(options);
    await createProject(options);
   }