export type Section = {
  heading: string;
  content: string[];
};

export type LearnCategory = {
  id: string;
  title: string;
  intro?: string;
  sections: Section[];
  links: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export const learnContent: LearnCategory[] = [
  {
    id: "investment",
    title: "Investment",
    intro: "Master these core concepts to make your money work for you, navigate the stock market with confidence, and secure your financial future!",
    sections: [
      {
        heading: "Saving vs. Investing & The Rule of 6%",
        content: [
          "Before jumping into the market, you must balance paying down existing debt with building future wealth.",
          "**The Rule of 6%**: If the interest rate on your debt is higher than 6%, prioritize paying it off. If it is lower than 6%, you may be better off investing your extra cash, as market returns typically average higher than your debt cost.",
          "**Wealth Growth vs. Preservation**: Young professionals should focus on Wealth Growth, which involves higher-risk investments that compound over a long time horizon. Later in life, the focus shifts to Wealth Preservation, using stable, low-risk assets to protect existing funds from market downturns and inflation."
        ]
      },
      {
        heading: "Building Your Portfolio",
        content: [
          "**Investment Income**: You purchase these investments because you want a predictable, steady source of cash flow. This strategy relies on assets like GICs, Savings Bonds, Treasury Bills, Preferred Shares, and Corporate Bonds.",
          "**Investment Growth**: You purchase these investments expecting them to increase in value over time. This strategy relies on Common Stocks, Mutual Funds, and Real Estate."
        ]
      },
      {
        heading: "Equities & Real Estate",
        content: [
          "The financial markets offer multiple vehicles for growth, but knowing what not to do is just as important.",
          "**The Stock Picking Trap**: Trying to pick individual winning companies is incredibly difficult. Historically, the stock market's overall wealth creation is driven by just 4% of \"superstocks\". Over half of all stocks lose money, and 86% of professional fund managers fail to outperform the broader market over a 10-year period.",
          "**Common Stocks**: When you buy a stock, you are buying a piece of ownership in a corporation. Companies issue stock to finance their business, and investors make money if the share price rises (capital gains) or if the company pays out a portion of its profits (dividends).",
          "**Real Estate**: This involves buying property and selling it when it increases in value. Success heavily depends on location, property condition, financing availability, and property taxes."
        ]
      },
      {
        heading: "Fixed Income",
        content: [
          "These are lower risk than shares and provide stable, predictable returns.",
          "**Bonds**: Bonds are essentially loans you make to governments or corporations. They pay you a stated interest rate (coupon rate) twice a year, and repay the face value amount at maturity. They operate on a see-saw principle: when overall interest rates go up, the price of existing bonds goes down.",
          "**Government Debt**: The safest forms of fixed income are backed by national governments, such as Treasury Bills (very short-term bonds of one year or less) and Savings Bonds.",
          "**Corporate Bonds & Debentures**: These are issued by companies and carry a higher risk of default than government bonds. Debentures are completely unsecured and backed only by the reputation of the issuing company.",
          "**GICs (Guaranteed Investment Certificates)**: A secure investment that guarantees 100% of your original principal while earning a predictable rate of interest."
        ]
      },
      {
        heading: "Pooled Investments",
        content: [
          "Instead of betting on single stocks or bonds, pooled investments allow you to buy a basket of securities to instantly reduce your risk.",
          "**Mutual Funds**: A pool of money run by a group of professionals who buy a diversified mix of debt and common shares. While they offer easy diversification, they often come with high ongoing management fees (MERs) and purchase costs.",
          "**Index Funds**: A specific type of mutual fund that tracks a market index rather than trying to beat it. They cannot be bought and sold throughout the day, but they have lower fees than active mutual funds and are excellent for regular, automated monthly investing.",
          "**ETFs (Exchange-Traded Funds)**: ETFs provide the same diversification as a mutual fund but with the flexibility of a stock. They trade on exchanges throughout the day, generally feature the lowest management fees, and are highly recommended for building long-term wealth."
        ]
      },
      {
        heading: "Strategies for Success: Diversification & DRIPs",
        content: [
          "Consistency and variety are the secrets to surviving market volatility.",
          "**Diversification**: Never put all your eggs in one basket. Spreading your investments across different asset classes, industries, and global geographies ensures that if one sector underperforms, others can help balance the losses.",
          "**Dollar-Cost Averaging**: Invest a set amount of money regularly (e.g., every month) regardless of market conditions. This removes emotion from investing and naturally lowers the average cost of your shares by buying more when prices are low.",
          "**DRIP Investing**: A Dividend Reinvestment Plan (DRIP) automatically takes the cash dividends paid out by your stocks and uses them to purchase additional, often fractional, shares of that same company. This rapidly accelerates the compounding effect of your portfolio."
        ]
      }
    ],
    links: [
      "https://www.raymondjames.com/mendhamwealth/resources/robs-investing-corner/2025/10/20/why-stock-picking-is-hard",
      "https://www.scotiabank.com/ca/en/personal/advice-plus/features/posts.diversification-can-help-manage-volatility.html",
      "https://www.rbcroyalbank.com/en-ca/my-money-matters/inspired-investor/ideas-and-motivation/should-you-be-investing-or-saving-right-now/",
      "https://www.td.com/ca/en/investing/direct-investing/learn-to-invest/drip-investing#:~:text=A%20dividend%20reinvestment%20plan%2C%20or,they%20move%20up%20or%20down.",
      "https://www.bmogam.com/ca-en/products/exchange-traded-funds/",
      "https://holbornassets.com/blog/wealth-preservation-vs-wealth-growth-which-strategy-is-right-for-you/"
    ]
  },
  {
    id: "general-pfl",
    title: "General PFL",
    intro: "Personal financial planning is the process of managing your money to achieve personal economic satisfaction. Doing so provides significant advantages, including increased control over your resources, healthier personal relationships, and reduced stress. Here are some tips on how to build a financial strategy based on YOUR values and goals.",
    sections: [
      {
        heading: "Setting SMART Financial Goals",
        content: [
          "First, evaluate your personal values to ensure your goals align with them. Without alignment, your budget will lack purpose. To make your financial goals actionable rather than just vague aspirations, they should be SMART: Specific, Measurable, Achievable, Relevant, and Timely. By giving a goal a specific timeframe and measurable cost, you can determine exactly what steps are required to achieve it."
        ]
      },
      {
        heading: "Measuring Your Financial Health",
        content: [
          "To understand your current situation, familiarize yourself with two key personal financial statements.",
          "A **cash flow statement** summarizes your cash receipts and payments over a period of time, revealing your monthly surplus or deficit.",
          "A **balance sheet** provides a snapshot of what you own (assets) and what you owe (liabilities) to determine your overall net worth.",
          "You can further evaluate your standing using financial ratios, which act as measurement tools for your finances:",
          "**Savings Ratio**: You should aim to save 10% or more of your gross income each month.",
          "**Liquidity Ratio**: You should ideally have enough liquid assets to cover 3 to 6 months of living expenses in case your income ceases.",
          "**Debt Payments Ratio**: A healthy ratio means 20% or less of your take-home pay goes toward monthly debt repayments."
        ]
      },
      {
        heading: "Shifting from a Budget to a Spending Plan",
        content: [
          "Many people struggle with traditional budgeting because it feels restrictive and is unpleasant to monitor. Furthermore, people are often bad at predicting their own behavior and terrible at imagining future expenses.",
          "For success, shift your mindset from a budget to a \"spending plan\". A spending plan promotes intentional spending and saving, allowing a remainder of money for you to spend how you choose.",
          "**Best Practices for Spending Plans:**",
          "**Pay Yourself First**: Commit to forced, automatic monthly savings directed toward your goals before spending on discretionary items.",
          "**Automate**: Set up automatic regular savings deposits from your chequing to your savings accounts, eventually working up to a 20% savings rate.",
          "**Use Savings \"Buckets\"**: Maintain separate savings accounts for distinct purposes, such as an emergency fund, annual fixed expenses, and specific goals."
        ]
      },
      {
        heading: "Learn the Economy & Time Value of Money",
        content: [
          "Master how broader economic trends and the mathematics of interest dictate your financial success.",
          "**Economic Factors** Understanding the broader economy helps protect your wallet. Inflation and consumer behavior directly influence your purchasing power and job stability.",
          "**Track your purchasing power**: Monitor inflation, which is a rise in the general level of prices that reduces the overall value of the dollar.",
          "**Protect vulnerable assets**: Recognize that rising inflation is particularly harmful to individuals who are living on fixed incomes.",
          "**Watch the job market**: Understand that overall consumer spending drives the demand for goods, which directly influences employment opportunities.",
          "**Time Value of Money (TVM)** The Time Value of Money refers to the mathematical increase in an amount of money as a result of interest earned over a period of time.",
          "**Accelerate your wealth**: Utilize compound interest, which accelerates growth by allowing you to earn interest on previously earned interest.",
          "**Look ahead**: Calculate the Future Value (FV) to determine what your current savings or annuity payments will be worth later based on a specific interest rate.",
          "**Work backward**: Calculate the Present Value (PV) to figure out exactly how much you must deposit today to achieve a specific, desired financial goal in the future."
        ]
      }
    ],
    links: [
      "https://www.fca.org.uk/investsmart/understanding-high-risk-investments"
    ]
  },
  {
    id: "budgeting",
    title: "Budgeting",
    sections: [
      {
        heading: "The 50/30/20 Rule (The Classic)",
        content: [
          "This highly popular method divides your after-tax income into three distinct buckets to help you balance financial stability with enjoying your life.",
          "**50% Needs**: Half of your income should be dedicated to absolute essentials, such as rent, basic groceries, utilities, and your minimum debt payments.",
          "**30% Wants**: This portion is for discretionary spending, allowing you to enjoy dining out, entertainment, hobbies, and travel without financial guilt.",
          "**20% Savings & Debt**: The final piece is dedicated to your future by building an emergency fund, investing for retirement, or making extra payments to eliminate debt faster."
        ]
      },
      {
        heading: "The 70/20/10 Rule (The Streamlined Approach)",
        content: [
          "If separating \"needs\" from \"wants\" feels too restrictive or tedious, this alternative rule simplifies your spending into broader, easier-to-track categories.",
          "**70% Living Expenses**: This large bucket combines both your essential needs and your discretionary wants into one overarching monthly spending allowance.",
          "**20% Savings & Investments**: A full fifth of your income is prioritized strictly for building your wealth, emergency reserves, and long-term financial security.",
          "**10% Debt Payoff or Donation**: The remaining tenth is used to aggressively pay down debt beyond the minimum payments, or, if you are debt-free, to donate to charitable causes or invest further."
        ]
      },
      {
        heading: "Choosing Your Strategy",
        content: [
          "The best budgeting method is the one you can stick to consistently over time.",
          "**Who should use 50/30/20**: This is excellent for beginners or students who need clear, strict boundaries to prevent their \"fun\" spending from accidentally eating into their rent or grocery money.",
          "**Who should use 70/20/10**: This is great for those who want less micro-management of their daily spending, but still want to ensure a solid 30% of their income is fiercely protecting their future and clearing debt.",
          "**Remain Flexible**: These are guidelines, not permanent laws. You can and should adjust the percentages as your income, housing costs, and living situations change throughout university and your career."
        ]
      },
      {
        heading: "Budgeting Pitfalls to Avoid",
        content: [
          "Even the best rules require discipline and foresight to execute properly.",
          "**Underestimating Expenses**: People often fail to budget for irregular annual costs like textbooks, car maintenance, or holiday gifts. You should set up a separate savings \"bucket\" specifically to catch these variable expenses so they don't derail your monthly plan.",
          "**Lifestyle Creep**: As you graduate and start earning more money, avoid the temptation to automatically increase your \"wants\" or \"living expenses\" spending. Funnel that extra cash into your savings or debt buckets first to accelerate your path to true financial freedom!"
        ]
      },
      {
        heading: "5-STEP BUDGETING PLAN",
        content: [
          "**Step 1: Add your expenses and income.** You've already done this step if you created a cash flow statement (see Chapter 3). If not, calculate your total income and expenses to see if you're covering all your costs.",
          "**Step 2: Review your categories.** Now look at how much you're spending in each category. Does what you're spending make sense? Perhaps you didn't realize just how much those visits to Winners were costing you.",
          "**Step 3: Create a category for savings.** Most budgeters forget to account for savings. It's not really an expense, but it is money you need to deduct from your paycheque every month Allocate some of your income to this category.",
          "**Step 4: Examine your goals.** In the context of all your other savings and spending, see how much it will cost to achieve your many goals.",
          "**Step 5: Start moving things around.** After you've completed the previous steps, the fun begins. It's time to prioritize your spending. Mortgage or rent usually tops the list because you need a place to live. Note that you won't have much wiggle room with your day-to-day expenses (mortgage or rent, utilities, and groceries) because the costs likely stay the same each month. Next, look at your discretionary categories - eating out, travel, movies - and start cutting back if necessary. Also consider the designation of funds for each of your goals."
        ]
      }
    ],
    links: [
      "https://www.unfcu.org/financial-wellness/50-30-20-rule/",
      "https://www.businessinsider.com/personal-finance/banking/70-20-10-budget"
    ]
  },
  {
    id: "consumer-behaviour",
    title: "Consumer Behaviour",
    intro: "Master your mindset to avoid marketing traps, eliminate impulsive spending, and make deliberate choices that build true wealth!",
    sections: [
      {
        heading: "Financial Mindfulness",
        content: [
          "Your mindset is just as important as your math skills when managing money.",
          "**What it is**: Financial mindfulness is the practice of being fully present and aware of your financial activities without judgment or emotional reactions. It means being conscious of where your money is going and making deliberate, rather than impulsive, decisions.",
          "**The Benefits**: Regular mindfulness practice improves your ability to resist spending temptations, naturally leading to increased savings. It provides the mental clarity needed to tackle debt and aligns your daily micro-decisions with your long-term macro goals."
        ]
      },
      {
        heading: "FOMO - Fear Of Missing Out",
        content: [
          "Our spending is heavily influenced by what we see others doing, especially online.",
          "FOMO, or the \"fear of missing out,\" is the sensation of unease or anxiety that comes from feeling like other people are having a better time or living a better life than you.",
          "Advertisers and financial \"influencers\" use FOMO to convince you that you are missing out in order to sell their products or get-rich-quick schemes. Remember that social media posts are highly curated and contain, at best, only part of the true picture."
        ]
      },
      {
        heading: "The Cost of Mindless Spending",
        content: [
          "Acting on FOMO or raw emotion can derail your long-term financial plans.",
          "The sensation of missing out can spur you to make impulsive or ill-considered decisions because you feel like you must act fast or lose your chance.",
          "This mindset often leads to impulse spending, excessively risky investments, and neglecting your savings in favour of immediate gratification. It can also make you far more vulnerable to scammers."
        ]
      },
      {
        heading: "Strategies for Mindful Money",
        content: [
          "Take control of your consumer behaviour by building proactive habits.",
          "**Hit the Pause Button**: Before making a purchase, take a time-out. Give yourself a day or two to consider the matter and ask yourself: \"Can I afford it without going into debt?\" and \"How will this improve my financial life?\".",
          "**Limit Social Media**: Reducing your time on social media decreases FOMO, anxiety, and the constant pressure to spend.",
          "**Get a Second Opinion**: If you feel drawn toward an unusual purchase or investment, consult a friend, colleague, or financial professional. If you feel uneasy or embarrassed about sharing the idea, your intuition is likely telling you something is wrong."
        ]
      }
    ],
    links: [
      "https://www.rbcroyalbank.com/en-ca/my-money-matters/money-academy/banking-basics/money-mindset/the-impact-of-fomo-on-financial-decisions/",
      "https://www.ig.ca/en/insights/financial-mindfulness--the-key-to-enhancing-your-financial-life"
    ]
  },
  {
    id: "student-loans",
    title: "Student Loans & Financial Aid",
    sections: [
      {
        heading: "Scholarships, Awards and Bursaries",
        content: [
          "**Scholarships**: Scholarships are resources that help students financially to pay for their education. There are many categories of scholarships, like entrance scholarships, academic, athletic, scholarships for ethnic minorities, first-generation scholarships, student identity-based scholarships, scholarships by major, and much more.",
          "**Awards**: Awards are based on recognition for your achievements, contributions and performance in the community, school, or more. They come in many forms, such as certificates, plaques, and the most popular, monetary awards. There are many categories for awards, like: performance-based awards, innovation awards, team awards, community involvement awards, academic awards, and much more.",
          "**Bursaries**: Bursaries are like a scholarship that provides financial support to students struggling with money. It behaves in the same way as a scholarship, and it has similar categories. Some requirements may need to be met, like being enrolled in a program or being part of a certain organization, but they exist to help students when money is tight."
        ]
      },
      {
        heading: "What are some things I should keep in mind?",
        content: [
          "If you are interested in applying, keep in mind that most applications have deadlines. Always read the requirements and needed documents to make sure your application is complete and strong. Write the dates on your personal calendar to keep track of deadlines. Some applications may require written essays, letters of recommendation, or a letter of interest, so organizing your time is crucial to increasing your chances of getting in."
        ]
      },
      {
        heading: "Where can I find scholarships, awards, and bursaries?",
        content: [
          "As a first-time applicant, it is best to start through your school’s scholarship portal. They often offer many types of financial aid for incoming and current students. The government of Canada also offers scholarships, bursaries, and awards for post-secondary students through their portal. Another great place to find scholarships is through Ontario Universities INFO, where they offer opportunities for every category, from indigenous scholarships to GPA scholarships.",
          "Below you will find some of these institutions’ portals:",
          "● https://students.yorku.ca/sfs/scholarships-awards-bursaries",
          "● https://www.yorku.ca/laps/student-awards/",
          "● https://www.ouinfo.ca/scholarships",
          "● https://studentawards.com/",
          "● https://www.scholarshipscanada.com/"
        ]
      },
      {
        heading: "Notable Types of Grants:",
        content: [
          "**Apprenticeship Completion Grant**: This grant is given to registered apprentices who have completed their apprenticeship training and get their journeyperson certification.",
          "**Apprenticeship Incentive Grant**: This grant is for apprentices who've completed either their first or second vear or level of an apprenticeship program in a designated Red Seal trade.",
          "**Athlete Assistance Program**: The program provides funding for athletes who are training for world-class performances while working or in school.",
          "**Legal Studies for Aboriginal People Program**: Métis or Non-Status Indians who want to go to law school may be eligible for this bursary.",
          "**Post-Secondary Student Support Program**: This program offers financial assistance to First Nations and eligible Inuit students who are enrolled in eligible postsecondary programs.",
          "**University and College Entrance Preparation Program for Aboriginal People**: This program provides financial assistance for First Nations and Inuit students for courses they need to take in order to meet the admis- sion requirements for postsecondary studies."
        ]
      }
    ],
    links: [
      "https://www.allvoices.co/glossary/awards-and-prizes",
      "https://www.grantme.ca/blog/5-types-of-scholarships-for-canadian-students",
      "https://www.grantme.ca/blog/what-is-a-student-bursary",
      "https://www.grantme.ca/blog/how-do-scholarships-work",
      "https://www.ciro.ca/office-investor/understanding-risk/risk-borrowing-invest#:~:text=HAVE%20YOU:,let%20your%20financial%20advisor%20know."
    ]
  },
  {
    id: "scams",
    title: "Scams",
    intro: "Not every financial opportunity is legitimate. Master these core concepts to recognize red flags, protect your capital, and safely manage your money!",
    sections: [
      {
        heading: "Spotting Pyramid Schemes",
        content: [
          "Investment fraud often masquerades as an exclusive opportunity. Protect yourself by knowing the warning signs.",
          "**The False Promise**: If an opportunity promises unusually high returns in a very short period with the promise of passive income, it is likely a fraud.",
          "**The Mechanism**: Pyramid schemes rely heavily on recruiting new members to pay off early investors rather than selling a genuine product or service.",
          "**The Golden Rule**: Always remember the golden rule: if an opportunity sounds too good to be true, it is."
        ]
      },
      {
        heading: "The Mathematical Reality",
        content: [
          "Pyramid schemes are designed to benefit the founders at the top while exploiting everyone else.",
          "**Built to Fail**: Because they require a constant, exponentially growing stream of new recruits to generate cash flow, all pyramid schemes are mathematically destined to collapse.",
          "**The Inevitable Outcome**: When the recruitment slows down and the scheme eventually collapses, it leaves the vast majority of investors with nothing."
        ]
      },
      {
        heading: "Identifying Counterfeit Currency",
        content: [
          "If you handle cash in your business or job, you are the first line of defense against counterfeiting.",
          "**The Cost of Fakes**: If you are a victim of counterfeiting and accept a fake bill, you will not be compensated or reimbursed for the financial loss.",
          "**Touch and Feel**: On genuine Canadian bills, you should be able to feel raised ink on the large number and the words \"Bank of Canada\".",
          "**Tilt and Look**: Tilt the bill toward you to verify that there are sharp color changes in the metallic elements and holographic features within the large transparent window."
        ]
      },
      {
        heading: "Handling Suspicious Transactions",
        content: [
          "Knowing how to react when handed a fake bill keeps you safe and helps authorities.",
          "**Take Safe Action**: If you suspect you have been handed a counterfeit note, politely refuse the bill, explain your concerns, and ask the customer for another form of payment.",
          "**Involve Authorities**: Advise the customer to check the suspicious note with local police, and report the incident yourself to help authorities track counterfeiting in your community.",
          "**Legal Responsibility**: It is a criminal offence in Canada to knowingly use or keep counterfeit money, so never attempt to pass a suspicious bill along to someone else."
        ]
      }
    ],
    links: [
      "https://www.cfib-fcei.ca/en/tools-resources/counterfeit-cash-handling",
      "https://www.investor.gov/protect-your-investments/fraud/types-fraud/pyramid-schemes"
    ]
  },
  {
    id: "savings",
    title: "Savings",
    sections: [
      {
        heading: "Calculating What You Can Afford",
        content: [
          "One of the biggest mistakes mistakes buyers make is confusing how much a bank will loan them with how much they can actually afford.",
          "**The 40% Rule**: A general rule of thumb is that no more than 40% of your pre-tax monthly earnings should go toward debt payments, including your mortgage, credit cards, and student loans.",
          "**Down Payment Minimums**: The minimum down payment is 5% for homes up to $500,000. For homes between $500,000 and $1 million, you need 5% on the first $500K and 10% on the remainder. Homes over $1 million require at least 20%.",
          "**The 20% Advantage**: Even if it isn't required, scraping together a 20% down payment allows you to avoid paying for expensive mortgage insurance and protects you if property values decline."
        ]
      },
      {
        heading: "Tax-Advantaged Savings Accounts",
        content: [
          "Don't just save in a regular checking account. Let the government help you reach your down payment faster.",
          "**FHSA (First Home Savings Account)**: You can save up to $40,000 total (max $8,000 per year) toward a first home. Contributions reduce your taxable income, and all investment gains are completely tax-free when withdrawn to buy a home.",
          "**RRSP Home Buyers' Plan**: You can withdraw up to $60,000 tax-free from your retirement savings to use toward a home purchase, provided you pay the money back to your RRSP over a 15-year period."
        ]
      },
      {
        heading: "Aggressive Saving (The 1-Year Plan)",
        content: [
          "If you are determined to buy a house in the short term, you must drastically reduce your expenses and increase your cash flow.",
          "**Slash Housing & Transport**: Rent is usually your biggest expense; consider moving in with your parents, getting a roommate, or downsizing to fast-track your savings. Selling your car to save on insurance and maintenance will also give your savings a massive boost.",
          "**Use Cash & Cut Habits**: Switch to using physical cash for daily transactions to make yourself hyper-aware of your spending. Cut out digital subscriptions, skip expensive vacations, and funnel every tax return or bonus directly into your savings.",
          "**The \"Untouchable\" Account**: Set up an automatic transfer to a dedicated savings account and deny it even exists. Treat this money as completely off-limits for paying regular bills."
        ]
      },
      {
        heading: "Where to Park Your Money",
        content: [
          "How you hold your savings depends entirely on your home-buying timeline.",
          "**Short-Term (1 to 3 Years)**: If you plan to buy soon, keep your money in high-yield, low-risk accounts (like a High-Interest Savings Account) to protect your hard-earned down payment from sudden stock market crashes.",
          "**Long-Term (3+ Years)**: If your purchase is further out, consider investing your down payment funds. While the stock market fluctuates, historical returns are generally higher than basic savings accounts, allowing you to ride the wave of compound interest."
        ]
      },
      {
        heading: "Renting vs. Buying",
        content: [
          "**The Perks of Renting**: Renting provides ultimate mobility, lower initial costs, and frees you from maintenance and repair responsibilities (if something breaks, you simply call the landlord).",
          "**The Trade-offs of Renting**: The primary disadvantages are the complete lack of equity growth and a restricted lifestyle governed by landlords and leases. However, renters can still build wealth by investing the cash difference between their rent and what a mortgage payment would have been.",
          "**The Power of Buying**: Owning a home forces you to save money into a tangible asset, allowing you to grow your equity over time and benefit from tax-free capital gains on your principal residence. It also provides stability, the pride of ownership, and the lifestyle flexibility to personalize your space.",
          "**The Risks of Owning**: Homeowners face financial uncertainty because property values can drop, and they have limited mobility since selling a home takes time and you can get stuck if the real estate market plummets.",
          "**The Cash Flow Comparison**: You cannot simply compare the monthly rent to the monthly mortgage; you must analyze the total cash flow of both scenarios. Renting costs primarily consist of monthly rent, renter's insurance, and the interest lost on your security deposit. Buying costs must cover the down payment, mortgage, property taxes, home insurance, maintenance, repairs, condo fees, and the \"opportunity cost\" of the interest you could have earned if you had invested your down payment elsewhere."
        ]
      }
    ],
    links: [
      "https://www.wealthsimple.com/en-ca/learn/how-to-save-for-a-house#how_to_save_for_a_house_in_a_year"
    ]
  },
  {
    id: "taxes",
    title: "Taxes",
    intro: "Master these core concepts to navigate the Canadian tax system, maximize your returns, and keep more of your hard-earned money in the game!",
    sections: [
      {
        heading: "Understanding Income Tax",
        content: [
          "Taxes are essential contributions that fund public goods like roads, healthcare, and police forces, generally taking about one-third of every dollar you earn.",
          "**Progressive System**: Canada uses a progressive income tax system, meaning your tax rate increases as your taxable income increases.",
          "**Marginal vs. Average**: Your marginal tax rate is the rate of tax paid on your next dollar of taxable income. Your average tax rate is your total tax due divided by your total income, which is generally lower than your marginal rate.",
          "**Filing is Mandatory**: Every resident of Canada with taxable income must file a return every year, with the deadline typically falling on April 30th."
        ]
      },
      {
        heading: "Deductions vs. Credits",
        content: [
          "Both tools lower your tax bill, but they work in fundamentally different ways.",
          "**Tax Deductions**: A deduction (like childcare expenses or union dues) reduces your total taxable income. The actual dollar amount you save depends on your specific tax bracket.",
          "**Tax Credits**: A credit reduces the actual amount of total taxes you owe.",
          "**Refundable vs. Non-Refundable**: Non-refundable credits can reduce your federal tax bill to zero, but no further. Refundable credits are paid out to you even if your tax liability is zero."
        ]
      },
      {
        heading: "Student Tax Perks",
        content: [
          "The tax system includes specific rules designed to help post-secondary students stay afloat.",
          "**Always File**: Students should file a tax return even if they do not expect a refund. Filing is required to receive tax-free, income-tested benefits like the GST/HST credit and the Ontario Trillium Benefit.",
          "**Tax-Free Awards**: Income received from scholarships, bursaries, fellowships, and grants is not taxable.",
          "**Tuition Credits**: You can use your school tuition fees to reduce your taxable income. Unused tuition credits can be carried forward indefinitely or transferred (up to $5,000) to a spouse, parent, or grandparent."
        ]
      },
      {
        heading: "Tax-Advantaged Accounts",
        content: [
          "The government provides special accounts (Tax Shelters) to encourage saving and Investing:",
          "**TFSA (Tax-Free Savings Account)**: You never pay taxes on the investment income earned inside this specialized account.",
          "**RRSP (Registered Retirement Savings Plan)**: Any money deposited into an RRSP is deducted from your income in the year you contribute. You only pay taxes on it when you withdraw the money in retirement.",
          "**FHSA (First Home Savings Account)**: A hybrid account designed to help you save for a principal residence. Contributions are tax-deductible, and withdrawals used for a qualified property are tax-free."
        ]
      }
    ],
    table: {
      headers: ["Feature", "RRSP", "TFSA"],
      rows: [
        ["Yearly contribution limit", "18% of income earned in the previous year up to a maximum of $29,210 in 2022", "$6000"],
        ["Taxable", "Pre-tax dollars are invested; growth and capital are taxed upon withdrawal", "After-tax dollars are invested; growth is never taxed"],
        ["Contribution carried forward", "Until you turn 71", "Forever"],
        ["Minimum age", "Whenever you start earning an income and paying taxes", "18"],
        ["Contribution", "Pre-tax dollars", "After-tax dollars"],
        ["Tax refund", "Yes", "No"],
        ["Withdrawal penalties", "Yes, must pay withholding taxes and lose contribution room", "No, as long as you don't recontribute during the same year you withdraw"],
        ["Maximum lifetime contribution", "Depends on your age and income", "$81,500 in 2022"]
      ]
    },
    links: [
      "https://www.investorsedge.cibc.com/en/learn/investing/etfs-and-mutual-funds/types-of-exchange-traded-funds.html"
    ]
  },
  {
    id: "credit-score",
    title: "Credit Score",
    intro: "Learn About Debt & Credit: Master these core concepts to build a strong financial reputation, avoid expensive debt traps, and win the game!",
    sections: [
      {
        heading: "Understanding Credit",
        content: [
          "Credit is an arrangement to receive something now and pay for it in the future. Using it wisely is key to financial success!",
          "**Good Debt vs. Bad Debt**: \"Good debt\" provides a return on investment or appreciates in value, such as a student loan for education or a mortgage for a home. \"Bad debt\" is used to finance everyday consumer spending or vacations.",
          "**Types of Credit**: Installment loans (like car loans) are paid back over a specific period with fixed payments. Revolving credit (like credit cards) allows you to borrow continuously up to a limit.",
          "**The Golden Rule**: Always weigh the benefits of buying an item on credit versus waiting until you have saved enough to pay in cash."
        ]
      },
      {
        heading: "The True Cost of Borrowing",
        content: [
          "Credit isn't free! Lenders charge interest, which is a periodic fee for using their money.",
          "**APR vs. EAR**: Don't just look at the quoted Annual Percentage Rate (APR). The Effective Annual Rate (EAR) is the true cost of the loan because it factors in how often the interest is compounded.",
          "**The Minimum Payment Trap**: Paying only the minimum required on a credit card means it will take much longer to repay your balance, and you will incur significantly more interest charges.",
          "**Term vs. Interest**: A longer loan term gives you lower monthly payments, but you will pay far more in total accumulated interest over the life of the loan."
        ]
      },
      {
        heading: "Building Your Credit Score",
        content: [
          "Your credit score ranges from 300 to 900 and acts as your financial report card. A high score helps you get credit faster and at better rates.",
          "**The 5 C's of Credit**: Creditors evaluate your Character (payment history), Capacity (ability to repay), Capital (net worth), Collateral (assets pledged), and Conditions (economic security).",
          "**Payment History**: This is a massive factor. Always pay your bills on time to maintain a healthy score.",
          "**Credit Utilization**: Keep your revolving debt balances low compared to your credit limits. Check your credit report annually to fix errors and watch for fraud."
        ]
      },
      {
        heading: "Managing Debt Safely",
        content: [
          "Borrowing too much restricts your future freedom. Keep your debt at manageable levels.",
          "**Credit Capacity**: A general rule is that your monthly debt payments (excluding your housing/mortgage) should not exceed 20% of your take-home pay.",
          "**Watch for Warning Signs**: You may be in debt trouble if you continually go over your credit limits, use credit for basic necessities, or borrow money just to make it to your next paycheque.",
          "**Seek Help Early**: If you fall into deep debt, options range from consolidation loans to consumer proposals, but these will negatively affect your ability to obtain credit in the future. Reach out to non-profit credit counseling before it gets out of hand!"
        ]
      },
      {
        heading: "Factors that determine credit score:",
        content: [
          "**35% for your payment history**: Of course, in you've been consistently late paying any of your bills or missing payments altogether, your credit will drop",
          "**30% for the total amount you owe**: Your total debt across all accounts plays a significant role, as wel as how much credit vou re using versus how much is available to you.",
          "**15% for the length of your credit history**: A person who's had one credit card for six months has a lower score in this section than someone who's had a number of cards over 20 years. The former has less of a repayment history for lenders to consider",
          "**10% for new credit applications**: Applying for too many loans (credit cards, lines of credit. or auto loans) within a year can raise red flags because it looks like you can't properly manage your finances",
          "**10% for the different types of credit you're using**: As mentioned, not all debt is equal. While this category is the least important facet of your credit score it's still worth noting that having a bunch of credit card loans does not have the same positive effect as having a mortgage."
        ]
      }
    ],
    links: [
      "https://www.scotiabank.com/ca/en/personal/advice-plus/features/posts.what-happens-when-your-credit-card-expires.html#:~:text=First%20things%20first!,t%20impact%20your%20credit%20score."
    ]
  }
];
