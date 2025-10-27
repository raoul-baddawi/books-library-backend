## ERD generation

The ERD will be auto generated when running `npx prisma generate`

If you're having issues generating the ERD on macos (or any arm64 cpu), then check this out:
https://www.npmjs.com/package/prisma-erd-generator#-arm64-users-

## Other helpful generators

- [prisma-generator-dart](https://github.com/FredrikBorgstrom/abcx3/tree/master/libs/prisma-generator-dart) - Generate dart classes with json serialization from prisma schema

- [prisma-generator-fake-data](https://github.com/luisrudge/prisma-generator-fake-data) - Generate fake data for your prisma schema using faker

You can find a list of community generators in the [prisma generators docs](https://www.prisma.io/docs/orm/prisma-schema/overview/generators).

## Seeding

Run `npx prisma db seed` to seed the database

Adding the `--clear` flag will clear the database before seeding
