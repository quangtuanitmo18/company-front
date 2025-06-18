# config valid only for current version of Capistrano
lock ">=3.6"

set :application, "company-front"
set :repo_url, "git@git.nms:ossa/company-front.git"

set :tmp_dir, "/tmp/company-front"
# Branch
set :branch, ENV['BRANCH'] if ENV['BRANCH']

# Default value for keep_releases is 5
set :keep_releases, 5

# Share files/directories between releases
#set :linked_dirs, []

# To use a .env file:
set :linked_files, [".env",".env.production"]

after 'deploy:symlink:linked_files', 'dependencies:npm'
after 'deploy:symlink:linked_files', 'dependencies:npm_encore'

set :permission_method, :acl
set :file_permissions_users, ["www-data"]
set :file_permissions_groups, ["www"]
# set :file_permissions_paths, ["var"]

# namespace :deploy do
#     task :permissions do
#         on roles(:all) do
#             if test("[ -d #{release_path} ]")
#                 execute "cd '#{release_path}'; sudo chown www-data:www var -R ;"
#                 puts "set permissions for #{release_path}"
#             end
#         end
#     end
# end
namespace :dependencies do
    task :npm do
        on roles(:all) do
            execute "cd '#{release_path}'; npm install;"
        end
    end
    task :npm_encore do
        on roles(:all) do
            execute "cd '#{release_path}'; npm run build;"
        end
    end
end
