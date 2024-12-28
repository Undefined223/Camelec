"use client";
import { NextPage } from 'next';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faAddressCard, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { GlareCard } from '../components/ui/glare-card';
import { Suspense } from 'react';
import Loading from '../components/Loading';

interface Props { }

const Page: NextPage<Props> = ({ }) => {
    return (
        <Suspense fallback={<Loading />}>

        <div className='min-h-[70vh] p-3 flex justify-around items-center flex-wrap gap-4'>
            <Link href="/profile/informations" legacyBehavior>
                <a>
                    <GlareCard className="flex flex-col items-center justify-center">
                        <FontAwesomeIcon icon={faInfoCircle} className="w-12 h-12 text-white" />
                        <p className="text-white font-bold text-xl mt-4">Informations</p>
                    </GlareCard>
                </a>
            </Link>
            <Link href="/profile/addresses" legacyBehavior>
                <a>
                    <GlareCard className="flex flex-col items-center justify-center">
                        <FontAwesomeIcon icon={faAddressCard} className="w-12 h-12 text-white" />
                        <p className="text-white font-bold text-xl mt-4">Addresses</p>
                    </GlareCard>
                </a>
            </Link>
            <Link href="/profile/orders" legacyBehavior>
                <a>
                    <GlareCard className="flex flex-col items-center justify-center">
                        <FontAwesomeIcon icon={faClipboardList} className="w-12 h-12 text-white" />
                        <p className="text-white font-bold text-xl mt-4">Orders</p>
                    </GlareCard>
                </a>
            </Link>
        </div>
        </Suspense>

    );
};

export default Page;
