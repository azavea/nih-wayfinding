### Building with Packer

`cp nih-vars.json.example nih-vars.json`

Then add your AWS access/secret keys to the file.

Ensure ansible role dependencies exist in `../ansible/roles` then:

```
packer build -var-file=nih-vars.json nih.json
```
