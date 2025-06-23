import './utils/env.test.js'
import { expect } from "expect"
import { sequelize } from "../models/index.js"
import { getAllAddressTypes } from "../services/addressTypes.js"
import './utils/env.test.js'

describe('Address Unit Tests', function () {
    this.timeout(5000)

    before(async function () {
        await sequelize.sync({ force: true })
    })

    describe('getAllByCompany Test', function () {
        it('should return [] for a fresh and empty DB', async function () {
            await expect(getAllAddressTypes()).resolves.toHaveLength(0)
        })
    })


})