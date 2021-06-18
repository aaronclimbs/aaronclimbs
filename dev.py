#!/usr/bin/env python3

import os
import textwrap

import requests

GH_API = "https://api.github.com"
DEVTO_API = "https://dev.to/api"

# GIST_ID = os.environ["INPUT_GIST_ID"]
# GH_TOKEN = os.environ["INPUT_GH_TOKEN"]
# DEVTO_USERNAME = os.environ["INPUT_DEVTO_USERNAME"] or "aaronclimbs"
DEVTO_USERNAME = "aaronclimbs"


def update_gist(description, content):
    params = {"scope": "gist"}
    headers = {"Authorization": "token {}".format(GH_TOKEN)}
    payload = {
        "description": description,
        "public": True,
        "files": {
            "Powered by Dev-Box!": {
                "content": content
            }
        }
    }

    response = requests.post(GH_API + "/gists/" + GIST_ID,
                             headers=headers,
                             params=params,
                             json=payload)

    if response.status_code == 200 or response.status_code == 201:
        print("Done! The gist was successfully updated!")
    else:
        raise Exception("Error while updating Gist, check your token!")


def get_article(username):
    response = requests.get(DEVTO_API + "/articles",
                            params={"username": username})

    if response.status_code == 200:
        try:
            return response.json()
        except IndexError:
            raise Exception("Dev.to query failed, no posts found!")
    else:
        raise Exception("Dev.to query failed, check the provided username!")


def main():

    for article in get_article(DEVTO_USERNAME):

        title = "# " + article["title"]
        created_at = article["readable_publish_date"]

        # Truncate and wrap long text.
        description = (article["description"][:150] + "...") if len(
            article["description"]) > 150 else article["description"]
        description = textwrap.fill(description, width=58)

        print(title)
        print(created_at)
        print(description)

        url = "dev.to" + article["path"]

        print(url)
        # payload = title + "\n" + description + "\n \n" + url

    # update_gist("📚 Dev.to - {}".format(created_at), payload)


if __name__ == "__main__":
    main()
