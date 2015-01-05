nih-wayfinding
==============

NIH Wayfinding Tools (Prototype)

## Build Status
[![](https://travis-ci.org/azavea/nih-wayfinding.svg?branch=develop)](https://travis-ci.org/azavea/nih-wayfinding)

## Local Development

A combination of Vagrant 1.5+ and Ansible 1.6+ is used to setup the development environment for this project. It creates the following virtual machines:

- `app`
- `services`

The `app` virtual machine contains an instance of the Angular/Scala application and `services` contains the PostgreSQL database and other services.

Use the following command to bring up a local development environment:

```bash
$ vagrant up
```

After provisioning is complete, you can login to the application server or services server:

```bash
$ vagrant ssh [app|services]
```

### Ports

The Vagrant configuration maps the following host ports to services
running in the VMs. You can change the host port numbers by setting
the environment variables listed in the ``Env Variable Override``
column.

Service                 | Port  | URL                                              | Env Variable Override
----------------------- | ----- | ------------------------------------------------ | ---------------------
Angular Web Application | 8000  | [http://localhost:8000](http://localhost:8000)   | NIH_WAYFINDING_PORT_8000
PostgreSQL              | 15432 |                                                  | NIH_WAYFINDING_PORT_5432
pgweb                   | 15433 | [http://localhost:15433](http://localhost:15433) | NIH_WAYFINDING_PORT_5433
livereload              | 35729 |                                                  | N/A


### JavaScript and CSS

TODO: add javascript/css instructions


### Caching

In order to speed up things up, you may want to consider using a local caching proxy. The `VAGRANT_PROXYCONF_ENDPOINT` environmental variable provides a way to supply a caching proxy endpoint for the virtual machines to use:

```bash
$ VAGRANT_PROXYCONF_ENDPOINT="http://192.168.96.10:8123/" vagrant up
```


## Testing

TODO: add testing instructions


## Deployment

TODO: add deployment instructions


### Dependencies

TODO: add dependency information
