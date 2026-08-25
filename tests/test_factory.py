import pytest


class TestAegisFactory:
    def test_vault_indexing(self):
        vaults = []
        def register(v: str):
            vaults.append(v)

        register("0x1111111111111111111111111111111111111111")
        register("0x2222222222222222222222222222222222222222")

        assert len(vaults) == 2
        assert vaults[0] == "0x1111111111111111111111111111111111111111"
