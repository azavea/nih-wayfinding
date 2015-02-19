### Provisioning EC2 instance

There is a feature/packer branch that was abandoned after issues compiling OTP on ubuntu 12.04

Instead, run the following commands manually:
```
sudo apt-get update
sudo apt-get install build-essential python-dev python-pip git
sudo pip install ansible==1.8.2

cd ~
git clone https://github.com/azavea/nih-wayfinding.git
```

At this point follow the 'Updating EC2 section' below.


#### Issues with maven on ubuntu 12.04

If on Ubuntu 12.04, the 'Compiling OTP' step will fail. To fix this, follow these steps, using sudo:
```
cd /opt/opentripplanner
wget http://maven.conveyal.com/org/processing/core/1.0.7/core-1.0.7.pom
wget http://maven.conveyal.com/org/processing/core/1.0.7/core-1.0.7.jar
wget http://maven.conveyal.com/crosby/binary/osmpbf/1.2.1/osmpbf-1.2.1.jar
wget http://maven.conveyal.com/crosby/binary/osmpbf/1.2.1/osmpbf-1.2.1.pom
mvn install:install-file -Dfile=core-1.0.7.jar -DpomFile=core-1.0.7.pom
mvn install:install-file -Dfile=osmpbf-1.2.1.jar -DpomFile=osmpbf-1.2.1.pom
cd ~/nih-wayfinding/deployment/ansible
ansible-playbook -i prototype_hosts --connection=local otp-servers.yml
```

Success!


### Updating EC2

SSH into the EC2 instance and run the following commands:
```
cd nih-wayfinding
git pull
cd deployment/ansible
ansible-galaxy install -r roles.txt -p roles
ansible-playbook -i prototype_hosts --connection=local app-servers.yml
ansible-playbook -i prototype_hosts --connection=local otp-servers.yml
```
