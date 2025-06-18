set :deploy_to, "/var/www/company-front"

set :controllers_to_clear, ["app_*.php"]
set :symfony_env,  "prod"
server "10.102.55.41", user: "deploy", roles: %w{db prod}, port: 22

set :ssh_options, {
    keys: %w(/home/user/.ssh/id_rsa),
    forward_agent: true,
    auth_methods: %w(publickey password)
}
