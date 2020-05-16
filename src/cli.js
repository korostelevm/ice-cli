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
   runInstall: args['--install'] || true,
   name: args['--name'] || false,
 };
}

function isNotSpecial(str){
    return !/[~`!#$%\^&*+=\[\]\\';,/{}|\\":<>\?]/g.test(str);
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
            var done = this.async();
            var valid = a.length>0 && isNotSpecial(a)
            if(!a.length>0)
                done('You need to provide a name')
            else if(!valid)
                done('The name contains invalid characters')
            else
                done(null, true);
            }
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
      name: options.name || answers.name.trim(),
      git: options.git || answers.git,
    };
   }
   
   export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createProject(options);
   }