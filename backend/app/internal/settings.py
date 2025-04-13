"""Settings for the application."""

from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Class for BaseSettings."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    REDIS_URL: str = "redis://default:tRPUE1EaIGDCkUwSUudXJdH0cQMFVO69EoKKbatJwuIsye3qD7hLXtSCPePIS2f6@yarissi.com:45689"

    SECRET_KEY: str = "IHR_GEHEIMES_SCHLÜSSEL_HIER"


settings = Settings()