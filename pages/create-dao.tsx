import { ExternalLinkIcon, LockClosedIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import Select from "../components/Select";
import { useMoralisData } from "../hooks/useMoralisData";
import { getAllEnsLinked, getTexts } from "../utils/crypto";

// import { createGroup } from "../utils/moralis-db";

declare let window: any;

interface InputProps {
  label: string;
  disabled?: boolean;
  value?: string;
  onChange?: () => void;
  placeholder?: string;
  showENSLink?: boolean;
  selectedEns?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  disabled = false,
  onChange,
  placeholder,
  showENSLink = false,
  selectedEns = "",
}) => {
  return (
    <div className="flex flex-col mb-5">
      <div className="flex justify-between">
        <span>{label}</span>
        {showENSLink && !!selectedEns?.length && (
          <a
            href={`https://app.ens.domains/name/${selectedEns}/details`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline flex"
          >
            Edit on ENS <ExternalLinkIcon width={20} height={20} />
          </a>
        )}
      </div>
      <div className="mt-2 relative">
        <input
          type="text"
          className="rounded-md w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {disabled && (
          <LockClosedIcon
            width={24}
            height={24}
            className="absolute top-2 right-2"
          />
        )}
      </div>
    </div>
  );
};

interface ENSResponse {
  id: string;
  name: string;
  labelName: string;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { account: selfAddress, isAuthenticated } = useMoralisData();
  const [address, setAddress] = useState("");
  const [ens, setEns] = useState<string | null>("");
  const [selectedEns, setSelectedEns] = useState(null);
  const [ensList, setEnsList] = useState<ENSResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [daoName, setDaoName] = useState("");
  const [url, setUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [snapshotUrl, setSnapshotUrl] = useState("");

  const fetchLinkedENS = async () => {
    if (!selfAddress) return;
    const ensLinked = await getAllEnsLinked(selfAddress);
    setEnsList(ensLinked.data.domains);
    setSelectedEns(ensLinked.data.domains[0].name);
  };

  const getAllURLsLinkedWithENS = async () => {
    if (!selfAddress) return;
    const { discordURL, twitterURL, URL } = await getTexts(selectedEns);
    console.log(discordURL, twitterURL, URL);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLinkedENS();
    }
  }, [isAuthenticated, selfAddress]);

  useEffect(() => {
    if (selectedEns) {
      getAllURLsLinkedWithENS();
    }
  }, [selectedEns]);

  return (
    <div className="bg-light-yellow min-h-screen">
      <div className="max-w-7xl pt-7 rounded-t-3xl my-0 mx-auto pb-0">
        <div className="flex justify-between font-audiowide py-6 px-4 rounded-md border-black border items-center bg-white">
          <h1 className="text-2xl">Project Details</h1>
          <div className="flex items-center">
            <p className="text-lg mr-4">Select ENS:</p>
            <Select
              options={ensList.map(({ name }) => ({
                label: name,
                key: name,
              }))}
              value={selectedEns}
              onChange={(e) => setSelectedEns(e)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 font-audiowide gap-4 mt-4">
          <div className="bg-white p-8 rounded-lg border border-black">
            <p className="text-lg">DAO Details</p>
            <hr className="mt-4 mb-4" />
            <Input label="Name" />
            <Input label="URL" disabled showENSLink selectedEns={selectedEns} />
            <Input
              label="Twitter"
              disabled
              showENSLink
              selectedEns={selectedEns}
            />
            <Input
              label="Discord"
              disabled
              showENSLink
              selectedEns={selectedEns}
            />
            <Input label="Snapshot" />
          </div>
          <div className="bg-white rounded-lg p-8 border border-black">
            <p className="text-lg mb-4">Token Details</p>
            <hr className="mt-4 mb-4" />
            <div className="flex flex-col">
              <span>Token Logo</span>
            </div>
            <Input label="Token Symbol" />
            <Input label="Decimals" />
            <Input label="Token Supply" />
            <Button className="w-full">Create DAO</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;