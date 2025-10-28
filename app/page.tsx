export const dynamic = "force-dynamic";

import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listing/ListingCard";
import ChatbotWrapper from "@/components/ChatbotWrapper"; // Import ChatbotWrapper
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const listing = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  return (
    <>
      {/* Welcome Message */}
      <h1 className="text-center text-2xl font-bold mb-6">
        Welcome to the Website
      </h1>

      {/* If no listings are available */}
      {listing.length === 0 ? (
        <ClientOnly>
          <EmptyState showReset />
          <ChatbotWrapper /> {/* Add ChatbotWrapper */}
        </ClientOnly>
      ) : (
        // If listings are available
        <ClientOnly>
          <Container>
            <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8 overflow-x-hidden">
              {listing.map((list) => {
                return (
                  <ListingCard
                    key={list.id}
                    data={list}
                    currentUser={currentUser}
                  />
                );
              })}
            </div>
          </Container>
          <ChatbotWrapper /> {/* Add ChatbotWrapper */}
        </ClientOnly>
      )}
    </>
  );
}