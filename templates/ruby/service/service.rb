# lambda_function.rb
require 'logger'
require 'json'


def lambda_handler(event:, context:)
  logger = Logger.new($stdout)
  logger.info('## ENVIRONMENT VARIABLES')
  vars = Hash.new
  object_jawn = Hash.new
  ENV.each do |variable|
    vars[variable[0]] = variable[1]
  end
  logger.info(vars.to_json)
  logger.info('## EVENT')
  logger.info(event.to_json)
  logger.info('## CONTEXT')
  logger.info(context.to_json)

  object_jawn['vars'] = vars
  object_jawn['event'] = event
  object_jawn['context'] = context
  
  # no return??
  {
    statusCode:200, 
    headers:{
      'Content-Type':'application/json'
    }
    body: JSON.generate(object_jawn)
  }

end