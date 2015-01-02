# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 1.5"
require "yaml"

# Deserialize Ansible Galaxy installation metadata for a role
def galaxy_install_info(role_name)
  role_path = File.join("deployment", "ansible", "roles", role_name)
  galaxy_install_info = File.join(role_path, "meta", ".galaxy_install_info")

  if (File.directory?(role_path) || File.symlink?(role_path)) && File.exists?(galaxy_install_info)
    YAML.load_file(galaxy_install_info)
  else
    { install_date: "", version: "0.0.0" }
  end
end

# Uses the contents of roles.txt to ensure that ansible-galaxy is run
# if any dependencies are missing
def install_dependent_roles
  ansible_directory = File.join("deployment", "ansible")
  ansible_roles_txt = File.join(ansible_directory, "roles.txt")

  File.foreach(ansible_roles_txt) do |line|
    role_name, role_version = line.split(",")
    role_path = File.join(ansible_directory, "roles", role_name)
    galaxy_metadata = galaxy_install_info(role_name)

    if galaxy_metadata["version"] != role_version.strip
      unless system("ansible-galaxy install -f -r #{ansible_roles_txt} -p #{File.dirname(role_path)}")
        $stderr.puts "\nERROR: An attempt to install Ansible role dependencies failed."
        exit(1)
      end

      break
    end
  end
end

# Install missing role dependencies based on the contents of roles.txt
if [ "up", "provision", "status" ].include?(ARGV.first)
  install_dependent_roles
end

if !ENV["VAGRANT_ENV"].nil? && ENV["VAGRANT_ENV"] == "TEST"
  ANSIBLE_ENV_GROUPS = {
    "test:children" => [
      "app-servers", "services"
    ]
  }
  VAGRANT_NETWORK_OPTIONS = { auto_correct: true }
else
  ANSIBLE_ENV_GROUPS = {
    "development:children" => [
      "app-servers", "services"
    ]
  }
  VAGRANT_NETWORK_OPTIONS = { auto_correct: false }
end

SERVICES_IP = ENV.fetch("NIH_WAYFINDING_SERVICES_IP", "33.33.33.30")
ANSIBLE_GROUPS = {
  "app-servers" => [ "app" ],
  "services" => [ "services" ]
}
ANSIBLE_EXTRA_VARS = {
  postgresql_host: SERVICES_IP
}
VAGRANT_PROXYCONF_ENDPOINT = ENV["VAGRANT_PROXYCONF_ENDPOINT"]
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # Travis does not yet support trusty
  config.vm.box = "ubuntu/precise64"

  # Wire up the proxy if:
  #
  #   - The vagrant-proxyconf Vagrant plugin is installed
  #   - The user set the VAGRANT_PROXYCONF_ENDPOINT environmental variable
  #
  if Vagrant.has_plugin?("vagrant-proxyconf") &&
     !VAGRANT_PROXYCONF_ENDPOINT.nil?
    config.proxy.http     = VAGRANT_PROXYCONF_ENDPOINT
    config.proxy.https    = VAGRANT_PROXYCONF_ENDPOINT
    config.proxy.no_proxy = "localhost,127.0.0.1"
  end

  # VM containing PostgreSQL and any other services we need to define
  config.vm.define "services" do |services|
    services.vm.hostname = "services"
    services.vm.network "private_network", ip: SERVICES_IP

    services.vm.synced_folder ".", "/vagrant", disabled: true

    # PostgreSQL
    services.vm.network "forwarded_port", {
      guest: 5432,
      host: ENV.fetch("NIH_WAYFINDING_PORT_5432", 15432)
    }.merge(VAGRANT_NETWORK_OPTIONS)

    # Pgweb
    services.vm.network "forwarded_port", {
      guest: 5433,
      host: ENV.fetch("NIH_WAYFINDING_PORT_5433", 15433)
    }.merge(VAGRANT_NETWORK_OPTIONS)

    services.vm.provider "virtualbox" do |v|
      v.memory = 1024
    end

    services.vm.provision "ansible" do |ansible|
      ansible.playbook = "deployment/ansible/services.yml"
      ansible.groups = ANSIBLE_GROUPS.merge(ANSIBLE_ENV_GROUPS)
      ansible.extra_vars = ANSIBLE_EXTRA_VARS
      ansible.raw_arguments = ["--timeout=60"]
    end
  end

  # VM containing web app (Angular and Scala)
  config.vm.define "app" do |app|
    app.vm.hostname = "app"
    app.vm.network "private_network", ip: ENV.fetch("NIH_WAYFINDING_APP_IP", "33.33.33.10")

    app.vm.synced_folder ".", "/vagrant", disabled: true
    app.vm.synced_folder "src/nih_wayfinding", "/opt/app/"

    # Angular via Nginx
    app.vm.network "forwarded_port", {
      guest: 80,
      host: ENV.fetch("NIH_WAYFINDING_PORT_8000", 8000)
    }.merge(VAGRANT_NETWORK_OPTIONS)

    # Livereload server
    app.vm.network "forwarded_port", {
      guest: 35729,
      host: 35729,
    }.merge(VAGRANT_NETWORK_OPTIONS)

    app.ssh.forward_x11 = true

    app.vm.provision "ansible" do |ansible|
      ansible.playbook = "deployment/ansible/app-servers.yml"
      ansible.groups = ANSIBLE_GROUPS.merge(ANSIBLE_ENV_GROUPS)
      ansible.extra_vars = ANSIBLE_EXTRA_VARS
      ansible.raw_arguments = ["--timeout=60"]
    end
  end
end
