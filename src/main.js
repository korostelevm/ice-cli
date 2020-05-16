import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import replace from 'replace-in-file'



const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
 await copy(options.templateDirectory, options.targetDirectory, {
   clobber: false,
 });
  return replace({
    files: options.targetDirectory +'/*',
    from: /template-subdomain/g,
    to: options.name.toLowerCase(),
  })
}
async function initGit(options) {
    const result = await execa('git', ['init'], {
      cwd: options.targetDirectory,
    });
    if (result.failed) {
      return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

export async function createProject(options) {
 options = {
   ...options,
   targetDirectory: options.targetDirectory || (process.cwd()+'/'+options.name),
 };

 const currentFileUrl = import.meta.url;
 const templateDir = path.resolve(
   new URL(currentFileUrl).pathname,
   '../../templates',
   options.template.toLowerCase()
 );
 options.templateDirectory = templateDir;

 try {
   await access(templateDir, fs.constants.R_OK);
 } catch (err) {
   console.error('%s Invalid template name', chalk.red.bold('ERROR'));
   process.exit(1);
 }

 const tasks = new Listr([
    {
      title: 'Copy project files',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Initialize git',
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: 'Install lambda dependencies',
      task: (ctx, task) =>{
          if(options.template == 'js'){
            return projectInstall({
                cwd: options.targetDirectory,
              })
          }
          if(options.template == 'ruby'){
            return execa('echo',
             ['you selected a ruby project, it does deploy.. but youre mostly on your own with that one']
            ).then((res)=>{
                return task.skip(res.stdout);
            });
          }
      },
      skip: () =>
        !options.runInstall
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    },
    {
      title: 'Install vue dependencies',
      task: (ctx, task) =>{
        return projectInstall({
            cwd: options.targetDirectory+'/vue',
        })
     },
      skip: () =>
        !options.runInstall
? 'Pass --install to automatically install dependencies'
          : undefined,
    },
  ]);
 
  await tasks.run();


 console.log('%s '+options.name+' ready', chalk.green.bold('DONE'));
 
 if(options.template == 'js'){
    console.log('to run: %s', chalk.cyan.bold('cd ./'+options.name +' && npm run start'));
 }
 
 if(options.template == 'ruby'){
    console.log('to deploy: %s', chalk.cyan.bold('cd ./'+options.name +' && ./deploy.sh'));
 }

 return true;
}