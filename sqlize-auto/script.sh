#!/bin/bash

npx sequelize-auto --version

npx sequelize-auto              \
    -h $1                       \
    -d $2                       \
    -u $3                       \
    -p 5432                     \
    -e postgres                 \
                                \
    -o ./lib/database/models    \
    -l ts                       \
                                \
    --cm p                      \
    --cp c                      \
    --cf k                      \
    --sg                        \
    -a ./sqlize-auto/add.json   \
                                \
    --indentation 4
